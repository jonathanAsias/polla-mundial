import { createClient, createServiceClient } from "@/lib/supabase/server";
import type { PredictionWithMatch } from "@/lib/queries/profile";

export interface RankingEntry {
  id: string;
  username: string;
  avatar_url: string | null;
  total_points: number;
  predictions_count: number;
  rank: number;
}

export async function getRanking(limit = 100): Promise<RankingEntry[]> {
  const supabase = await createClient();

  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id, username, avatar_url, total_points")
    .order("total_points", { ascending: false })
    .limit(limit)
    .returns<
      Pick<
        RankingEntry,
        "id" | "username" | "avatar_url" | "total_points"
      >[]
    >();

  if (error) throw error;
  if (!profiles?.length) return [];

  const userIds = profiles.map((p) => p.id);
  const { data: predictions } = await supabase
    .from("predictions")
    .select("user_id")
    .in("user_id", userIds)
    .returns<{ user_id: string }[]>();

  const countMap = new Map<string, number>();
  for (const p of predictions ?? []) {
    countMap.set(p.user_id, (countMap.get(p.user_id) ?? 0) + 1);
  }

  return profiles.map((profile, index) => ({
    ...profile,
    rank: index + 1,
    predictions_count: countMap.get(profile.id) ?? 0,
  }));
}

export async function getUserPredictionsForRanking(
  userId: string
): Promise<PredictionWithMatch[]> {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("predictions")
    .select(
      `
      id, predicted_home, predicted_away, points_earned, submitted_at,
      match:matches(
        id, scheduled_at, home_score, away_score, status, phase,
        home_team:teams!matches_home_team_id_fkey(name, code),
        away_team:teams!matches_away_team_id_fkey(name, code)
      )
    `
    )
    .eq("user_id", userId)
    .order("submitted_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as unknown as PredictionWithMatch[];
}
