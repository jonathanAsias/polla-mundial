import { createServiceClient } from "@/lib/supabase/server";
import { calculateMatchPoints } from "@/lib/points";

export async function calculatePointsForMatch(matchId: number) {
  const supabase = createServiceClient();

  const { data: match, error: matchError } = await supabase
    .from("matches")
    .select("id, home_score, away_score, status")
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
      match.away_score
    );

    await supabase
      .from("predictions")
      .update({ points_earned: points })
      .eq("id", pred.id);

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
