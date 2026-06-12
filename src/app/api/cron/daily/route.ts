import { NextResponse } from "next/server";
import { verifyCronAuth } from "@/lib/cron-auth";
import { syncMatchResults } from "@/lib/matches-sync";
import { sendDailyPushReminders } from "@/lib/push-service";

export async function GET(request: Request) {
  const authError = verifyCronAuth(request);
  if (authError) return authError;

  try {
    const [sync, push] = await Promise.all([
      syncMatchResults().catch((e) => ({
        error: e instanceof Error ? e.message : "sync failed",
      })),
      sendDailyPushReminders().catch((e) => ({
        error: e instanceof Error ? e.message : "push failed",
      })),
    ]);

    return NextResponse.json({ ok: true, sync, push });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  return GET(request);
}
