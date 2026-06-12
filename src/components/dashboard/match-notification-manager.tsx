"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  NotificationOptIn,
  PredictionReminderBanner,
} from "@/components/dashboard/prediction-reminder-banner";
import type { MatchReminder } from "@/lib/queries/dashboard";

const POLL_MS = 5 * 60 * 1000;
const NOTIFY_BEFORE_MS = 2 * 60 * 60 * 1000;

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(base64);
  return Uint8Array.from(Array.from(raw, (char) => char.charCodeAt(0)));
}

export function MatchNotificationManager() {
  const [pending, setPending] = useState<MatchReminder[]>([]);
  const [notificationsOn, setNotificationsOn] = useState(false);
  const [loading, setLoading] = useState(false);
  const notifiedRef = useRef<Set<string>>(new Set());

  const fetchReminders = useCallback(async () => {
    try {
      const res = await fetch("/api/reminders");
      if (!res.ok) return [];
      const data = await res.json();
      setPending(data.pending ?? []);
      return data.pending as MatchReminder[];
    } catch {
      return [];
    }
  }, []);

  const showLocalNotification = useCallback((title: string, body: string) => {
    if (typeof window === "undefined" || Notification.permission !== "granted") {
      return;
    }

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        reg.showNotification(title, {
          body,
          icon: "/favicon.svg",
          badge: "/favicon.svg",
          tag: title,
          data: { url: "/dashboard" },
        });
      });
      return;
    }

    new Notification(title, { body, icon: "/favicon.svg" });
  }, []);

  const checkAndNotify = useCallback(
    (list: MatchReminder[]) => {
      if (typeof window === "undefined" || Notification.permission !== "granted") {
        return;
      }

      const now = Date.now();
      const todayKey = new Date().toDateString();
      const morningKey = `morning-${todayKey}`;

      if (list.length > 0 && !notifiedRef.current.has(morningKey)) {
        const hour = new Date().getHours();
        if (hour >= 8 && hour < 14) {
          notifiedRef.current.add(morningKey);
          showLocalNotification(
            "⚽ Partidos de hoy",
            `Tienes ${list.length} predicción${list.length > 1 ? "es" : ""} pendiente${list.length > 1 ? "s" : ""} en la jornada. Cierran 10 min antes de cada partido.`
          );
        }
      }

      for (const match of list) {
        const deadline = new Date(match.deadlineAt).getTime();
        const urgentKey = `urgent-${match.matchId}`;
        const msUntilDeadline = deadline - now;

        if (
          msUntilDeadline > 0 &&
          msUntilDeadline <= NOTIFY_BEFORE_MS &&
          !notifiedRef.current.has(urgentKey)
        ) {
          notifiedRef.current.add(urgentKey);
          showLocalNotification(
            "⏰ Predicción pendiente",
            `${match.homeTeam} vs ${match.awayTeam}: envía tu predicción antes de las ${new Date(match.deadlineAt).toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })}.`
          );
        }
      }
    },
    [showLocalNotification]
  );

  const registerServiceWorker = useCallback(async () => {
    if (!("serviceWorker" in navigator)) return null;
    return navigator.serviceWorker.register("/sw.js");
  }, []);

  const subscribePush = useCallback(async () => {
    const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!vapidKey) return;

    const registration = await registerServiceWorker();
    if (!registration) return;

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidKey),
    });

    await fetch("/api/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(subscription),
    });
  }, [registerServiceWorker]);

  const enableNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") return;

      await registerServiceWorker();

      try {
        await subscribePush();
      } catch {
        // Push remoto opcional si faltan VAPID keys o tabla SQL
      }

      setNotificationsOn(true);
      localStorage.setItem("push-reminders-enabled", "1");
      const items = await fetchReminders();
      checkAndNotify(items);
    } finally {
      setLoading(false);
    }
  }, [registerServiceWorker, subscribePush, fetchReminders, checkAndNotify]);

  useEffect(() => {
    const enabled =
      localStorage.getItem("push-reminders-enabled") === "1" ||
      (typeof window !== "undefined" && Notification.permission === "granted");
    setNotificationsOn(enabled);

    if (enabled) {
      registerServiceWorker();
    }

    fetchReminders().then((items) => {
      if (items.length) checkAndNotify(items);
    });

    const interval = setInterval(() => {
      fetchReminders().then((items) => {
        if (items.length) checkAndNotify(items);
      });
    }, POLL_MS);

    return () => clearInterval(interval);
  }, [fetchReminders, checkAndNotify, registerServiceWorker]);

  return (
    <>
      <NotificationOptIn
        onEnable={enableNotifications}
        loading={loading}
        enabled={notificationsOn}
      />
      <PredictionReminderBanner pending={pending} />
    </>
  );
}
