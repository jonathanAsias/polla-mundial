const DEFAULT_TIMEZONE = "America/Mexico_City";

/** Fechas del calendario FIFA en seed (horarios UTC). */
const FIFA_CALENDAR_TIMEZONE = "UTC";

export function getDayBoundsInTimezone(
  timeZone = DEFAULT_TIMEZONE,
  referenceDate = new Date()
): { start: Date; end: Date } {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const dateKey = formatter.format(referenceDate);

  const start = localDateTimeToUtc(dateKey, "00:00:00", timeZone);
  const end = localDateTimeToUtc(dateKey, "23:59:59", timeZone);

  return { start, end };
}

function localDateTimeToUtc(
  dateKey: string,
  time: string,
  timeZone: string
): Date {
  const [year, month, day] = dateKey.split("-").map(Number);
  const [hour, minute, second] = time.split(":").map(Number);

  const guess = new Date(Date.UTC(year, month - 1, day, hour, minute, second));
  const offsetMs = getTimeZoneOffsetMs(guess, timeZone);

  return new Date(guess.getTime() - offsetMs);
}

function getTimeZoneOffsetMs(date: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    timeZoneName: "shortOffset",
  }).formatToParts(date);

  const offset = parts.find((p) => p.type === "timeZoneName")?.value ?? "GMT";
  const match = offset.match(/GMT([+-])(\d+)(?::(\d+))?/);
  if (!match) return 0;

  const sign = match[1] === "-" ? -1 : 1;
  const hours = Number(match[2]);
  const minutes = Number(match[3] ?? 0);

  return sign * (hours * 60 + minutes) * 60 * 1000;
}

export function isSameDayInTimezone(
  isoDate: string | Date,
  timeZone = DEFAULT_TIMEZONE,
  referenceDate = new Date()
): boolean {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(new Date(isoDate)) === formatter.format(referenceDate);
}

/** Fecha calendario anterior en la zona horaria (p. ej. jornada que acaba de terminar). */
export function getPreviousCalendarDayInTimezone(
  timeZone = DEFAULT_TIMEZONE,
  referenceDate = new Date()
): Date {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const dateKey = formatter.format(referenceDate);
  const [year, month, day] = dateKey.split("-").map(Number);
  const utc = new Date(Date.UTC(year, month - 1, day));
  utc.setUTCDate(utc.getUTCDate() - 1);
  return utc;
}

export function formatCalendarDayInTimezone(
  date: Date,
  timeZone = DEFAULT_TIMEZONE
): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

/** Límites del día según calendario FIFA (UTC). */
export function getFifaCalendarDayBounds(referenceDate = new Date()): {
  start: Date;
  end: Date;
} {
  return getDayBoundsInTimezone(FIFA_CALENDAR_TIMEZONE, referenceDate);
}

export function formatFifaCalendarDay(referenceDate = new Date()): string {
  return formatCalendarDayInTimezone(referenceDate, FIFA_CALENDAR_TIMEZONE);
}

/** Fecha calendario del torneo (YYYY-MM-DD) o null fuera del Mundial. */
export function getTournamentCalendarDay(referenceDate = new Date()): string | null {
  const day = formatFifaCalendarDay(referenceDate);
  if (day < "2026-06-11" || day > "2026-07-19") return null;
  return day;
}

export { DEFAULT_TIMEZONE, FIFA_CALENDAR_TIMEZONE };
