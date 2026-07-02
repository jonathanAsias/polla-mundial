import type { PredictionWithMatch } from "@/lib/queries/profile";

/** Orden cronológico por fecha/hora del partido (más antiguo primero). */
export function sortPredictionsByMatchSchedule(
  predictions: PredictionWithMatch[]
): PredictionWithMatch[] {
  return [...predictions].sort((a, b) => {
    const ta = a.match?.scheduled_at
      ? new Date(a.match.scheduled_at).getTime()
      : 0;
    const tb = b.match?.scheduled_at
      ? new Date(b.match.scheduled_at).getTime()
      : 0;
    if (ta !== tb) return ta - tb;
    return (a.match?.id ?? 0) - (b.match?.id ?? 0);
  });
}
