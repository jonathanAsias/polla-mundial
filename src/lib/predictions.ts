const LOCK_MINUTES = 10;

export function getPredictionDeadline(scheduledAt: string | Date): Date {
  const matchTime = new Date(scheduledAt);
  return new Date(matchTime.getTime() - LOCK_MINUTES * 60 * 1000);
}

export function isPredictionLocked(
  scheduledAt: string | Date,
  status: string
): boolean {
  if (status === "live" || status === "finished") return true;
  return Date.now() >= getPredictionDeadline(scheduledAt).getTime();
}

export function isSameCalendarDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
