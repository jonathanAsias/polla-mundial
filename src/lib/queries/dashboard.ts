import { createClient } from "@/lib/supabase/server";
import type { MatchWithTeams } from "@/lib/queries/matches";
import type { Prediction } from "@/types/database";
import { isSameCalendarDay } from "@/lib/predictions";

export async function getDashboardMatches(): Promise<MatchWithTeams[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("matches")
    .select(
      `
      id, phase, scheduled_at, home_score, away_score, status, external_id, venue, city,
      home_team:teams!matches_home_team_id_fkey(id, name, code, flag_emoji),
      away_team:teams!matches_away_team_id_fkey(id, name, code, flag_emoji)
    `
    )
    .in("status", ["upcoming", "live"])
    .gte("scheduled_at", new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString())
    .order("scheduled_at", { ascending: true })
    .limit(50);

  if (error) throw error;

  const matches = (data ?? []) as unknown as MatchWithTeams[];
  const today = new Date();
  const todayMatches = matches.filter((m) =>
    isSameCalendarDay(new Date(m.scheduled_at), today)
  );

  if (todayMatches.length > 0) return todayMatches;
  return matches.slice(0, 3);
}

export async function getUserPredictionsForMatches(
  userId: string,
  matchIds: number[]
): Promise<Record<number, Prediction>> {
  if (matchIds.length === 0) return {};

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("predictions")
    .select("*")
    .eq("user_id", userId)
    .in("match_id", matchIds)
    .returns<Prediction[]>();

  if (error) throw error;

  return Object.fromEntries((data ?? []).map((p) => [p.match_id, p]));
}

export async function getTopRanking(limit = 10) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, username, avatar_url, total_points")
    .order("total_points", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}
