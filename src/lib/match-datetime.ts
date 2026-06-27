import { DEFAULT_TIMEZONE } from "@/lib/timezone";

const MATCH_LOCALE = "es-MX";

export function formatMatchDateTime(
  scheduledAt: string | Date,
  timeZone = DEFAULT_TIMEZONE
): string {
  return new Date(scheduledAt).toLocaleString(MATCH_LOCALE, {
    timeZone,
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatMatchDate(
  scheduledAt: string | Date,
  timeZone = DEFAULT_TIMEZONE
): string {
  return new Date(scheduledAt).toLocaleDateString(MATCH_LOCALE, {
    timeZone,
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatMatchTime(
  scheduledAt: string | Date,
  timeZone = DEFAULT_TIMEZONE
): string {
  return new Date(scheduledAt).toLocaleTimeString(MATCH_LOCALE, {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
  });
}
