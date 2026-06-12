import webpush from "web-push";
import { createServiceClient } from "@/lib/supabase/server";
import { getMatchRemindersForUser } from "@/lib/queries/dashboard";

function configureWebPush() {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT ?? "mailto:admin@polla-mundial.app";

  if (!publicKey || !privateKey) {
    throw new Error("VAPID keys no configuradas");
  }

  webpush.setVapidDetails(subject, publicKey, privateKey);
}

export async function savePushSubscription(
  userId: string,
  subscription: PushSubscriptionJSON
) {
  const supabase = createServiceClient();
  const keys = subscription.keys;
  if (!subscription.endpoint || !keys?.p256dh || !keys?.auth) {
    throw new Error("Suscripción push inválida");
  }

  const { error } = await supabase.from("push_subscriptions").upsert(
    {
      user_id: userId,
      endpoint: subscription.endpoint,
      p256dh: keys.p256dh,
      auth: keys.auth,
    },
    { onConflict: "user_id,endpoint" }
  );

  if (error) throw error;
}

export async function sendDailyPushReminders() {
  if (
    !process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
    !process.env.VAPID_PRIVATE_KEY
  ) {
    return { sent: 0, skipped: "VAPID no configurado" };
  }

  configureWebPush();
  const supabase = createServiceClient();

  const { data: subscriptions, error } = await supabase
    .from("push_subscriptions")
    .select("user_id, endpoint, p256dh, auth");

  if (error) throw error;
  if (!subscriptions?.length) return { sent: 0, users: 0 };

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  let sent = 0;
  const notifiedUsers = new Set<string>();

  for (const sub of subscriptions) {
    if (notifiedUsers.has(sub.user_id)) continue;

    const reminders = await getMatchRemindersForUser(
      sub.user_id,
      undefined,
      supabase
    );
    const pending = reminders.filter((r) => !r.hasPrediction && !r.locked);
    if (pending.length === 0) continue;

    const body =
      pending.length === 1
        ? `${pending[0].homeTeam} vs ${pending[0].awayTeam}: predice antes de que cierren las apuestas (10 min antes del partido).`
        : `Tienes ${pending.length} predicciones pendientes en la jornada de hoy.`;

    try {
      await webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: { p256dh: sub.p256dh, auth: sub.auth },
        },
        JSON.stringify({
          title: "⚽ Predicciones pendientes hoy",
          body,
          url: `${appUrl}/dashboard`,
        })
      );
      notifiedUsers.add(sub.user_id);
      sent++;
    } catch (err) {
      const status = (err as { statusCode?: number }).statusCode;
      if (status === 404 || status === 410) {
        await supabase
          .from("push_subscriptions")
          .delete()
          .eq("endpoint", sub.endpoint);
      }
    }
  }

  return { sent, users: notifiedUsers.size };
}
