import { createServiceClient } from "@/lib/supabase/server";
import { calculateMatchPoints } from "@/lib/points";
import {
  DEFAULT_TIMEZONE,
  formatFifaCalendarDay,
  getPreviousCalendarDayInTimezone,
} from "@/lib/timezone";
import { getExternalIdsForFifaDay } from "@/data/fifa-match-days";

export async function calculatePointsForMatch(matchId: number) {
  const supabase = createServiceClient();

  const { data: match, error: matchError } = await supabase
    .from("matches")
    .select("id, home_score, away_score, winner_side, status")
    .eq("id", matchId)
    .single();

  if (matchError || !match) {
    throw new Error(`Partido ${matchId} no encontrado`);
  }

  if (
    match.status !== "finished" ||
    match.home_score === null ||
    match.away_score === null
  ) {
    return { updated: 0, users: [] as string[] };
  }

  const { data: predictions, error: predError } = await supabase
    .from("predictions")
    .select("id, user_id, predicted_home, predicted_away")
    .eq("match_id", matchId);

  if (predError) throw predError;
  if (!predictions?.length) return { updated: 0, users: [] as string[] };

  const affectedUsers = new Set<string>();

  for (const pred of predictions) {
    const points = calculateMatchPoints(
      pred.predicted_home,
      pred.predicted_away,
      match.home_score,
      match.away_score,
      match.winner_side
    );

    const { error: updateError } = await supabase
      .from("predictions")
      .update({ points_earned: points })
      .eq("id", pred.id);

    if (updateError) {
      throw new Error(
        `No se pudo guardar puntos (predicción ${pred.id}): ${updateError.message}. ` +
          "¿Ejecutaste supabase/points_max_3.sql?"
      );
    }

    affectedUsers.add(pred.user_id);
  }

  for (const userId of Array.from(affectedUsers)) {
    await recalculateUserTotalPoints(userId);
  }

  return {
    updated: predictions.length,
    users: Array.from(affectedUsers),
  };
}

export async function recalculateUserTotalPoints(userId: string) {
  const supabase = createServiceClient();

  const { data: preds } = await supabase
    .from("predictions")
    .select("points_earned")
    .eq("user_id", userId);

  const total = (preds ?? []).reduce(
    (sum, p) => sum + (p.points_earned ?? 0),
    0
  );

  await supabase
    .from("profiles")
    .update({ total_points: total })
    .eq("id", userId);

  return total;
}

/**
 * Al cierre de la jornada: compara cada predicción con el resultado final
 * de los partidos finalizados de ese día y actualiza puntos + totales.
 */
export async function settleDayJornadaPoints(
  dayDate: Date = getPreviousCalendarDayInTimezone(),
  _timeZone = DEFAULT_TIMEZONE
) {
  const supabase = createServiceClient();
  const dayLabel = formatFifaCalendarDay(dayDate);
  const externalIds = getExternalIdsForFifaDay(dayLabel);

  if (externalIds.length === 0) {
    return {
      day: dayLabel,
      matchesProcessed: 0,
      predictionsUpdated: 0,
      matchIds: [] as number[],
    };
  }

  const { data: matches, error } = await supabase
    .from("matches")
    .select("id, external_id, home_score, away_score")
    .in("external_id", externalIds)
    .eq("status", "finished")
    .not("home_score", "is", null)
    .not("away_score", "is", null);

  if (error) throw error;

  let predictionsUpdated = 0;
  const matchIds: number[] = [];

  for (const match of matches ?? []) {
    const result = await calculatePointsForMatch(match.id);
    predictionsUpdated += result.updated;
    matchIds.push(match.id);
  }

  await recalculateAllUserTotals();

  return {
    day: dayLabel,
    matchesProcessed: matchIds.length,
    predictionsUpdated,
    matchIds,
  };
}

/** Recalcula puntos de todos los partidos finalizados (idempotente). */
export async function settleAllFinishedMatches() {
  const supabase = createServiceClient();

  const { data: matches, error } = await supabase
    .from("matches")
    .select("id")
    .eq("status", "finished")
    .not("home_score", "is", null)
    .not("away_score", "is", null);

  if (error) throw error;

  let predictionsUpdated = 0;

  for (const match of matches ?? []) {
    const result = await calculatePointsForMatch(match.id);
    predictionsUpdated += result.updated;
  }

  await recalculateAllUserTotals();

  return {
    matchesProcessed: matches?.length ?? 0,
    predictionsUpdated,
  };
}

export async function recalculateAllUserTotals() {
  const supabase = createServiceClient();
  const { data: profiles, error } = await supabase.from("profiles").select("id");

  if (error) throw error;

  for (const profile of profiles ?? []) {
    await recalculateUserTotalPoints(profile.id);
  }

  return profiles?.length ?? 0;
}
