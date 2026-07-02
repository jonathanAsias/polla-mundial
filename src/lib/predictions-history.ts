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
export function normalizeMatchEmbed<T>(
  value: T | T[] | null | undefined
): T | null {
  if (value == null) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

function normalizeMatchRow(
  match: PredictionWithMatch["match"] | PredictionWithMatch["match"][] | null | undefined
): PredictionWithMatch["match"] | null {
  const row = normalizeMatchEmbed(match);
  if (!row) return null;

  const home_team = normalizeMatchEmbed(row.home_team);
  const away_team = normalizeMatchEmbed(row.away_team);
  if (!home_team || !away_team) return null;

  return {
    ...row,
    home_team,
    away_team,
    phase: row.phase ?? inferPhaseFromExternalId(row.external_id),
  };
}

function inferPhaseFromExternalId(externalId: number | null | undefined): string {
  if (externalId == null || externalId <= 72) return "group";
  if (externalId <= 88) return "r32";
  if (externalId <= 96) return "r16";
  if (externalId <= 100) return "qf";
  if (externalId <= 102) return "sf";
  return "final";
}

export function normalizePredictionRows(
  rows: Array<
    PredictionWithMatch & {
      match?: PredictionWithMatch["match"] | PredictionWithMatch["match"][];
    }
  >
): PredictionWithMatch[] {
  return rows
    .map((row) => ({
      ...row,
      match: normalizeMatchRow(row.match),
    }))
    .filter((row): row is PredictionWithMatch => row.match != null);
}
