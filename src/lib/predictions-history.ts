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

/** Supabase a veces devuelve relaciones embebidas como arreglo. */
export function normalizeMatchEmbed<T>(match: T | T[] | null | undefined): T | null {
  if (match == null) return null;
  return Array.isArray(match) ? (match[0] ?? null) : match;
}

export function normalizePredictionRows(
  rows: Array<PredictionWithMatch & { match?: PredictionWithMatch["match"] | PredictionWithMatch["match"][] }>
): PredictionWithMatch[] {
  return rows
    .map((row) => ({
      ...row,
      match: normalizeMatchEmbed(row.match),
    }))
    .filter((row): row is PredictionWithMatch => row.match != null);
}
