import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/database";
import { sortPredictionsByMatchSchedule } from "@/lib/predictions-history";

export interface PredictionWithMatch {
  id: number;
  predicted_home: number;
  predicted_away: number;
  points_earned: number;
  submitted_at: string;
  match: {
    id: number;
    scheduled_at: string;
    home_score: number | null;
    away_score: number | null;
    winner_side: "home" | "away" | null;
    home_penalties: number | null;
    away_penalties: number | null;
    status: string;
    phase: string;
    home_team: { name: string; code: string };
    away_team: { name: string; code: string };
  };
}

export interface PointsChartPoint {
  date: string;
  label: string;
  earned: number;
  cumulative: number;
}

export async function getProfile(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data as Profile;
}

export async function getUserPredictionsHistory(
  userId: string
): Promise<PredictionWithMatch[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("predictions")
    .select(
      `
      id, predicted_home, predicted_away, points_earned, submitted_at,
      match:matches(
        id, scheduled_at, home_score, away_score, winner_side,
        home_penalties, away_penalties, status, phase,
        home_team:teams!matches_home_team_id_fkey(name, code),
        away_team:teams!matches_away_team_id_fkey(name, code)
      )
    `
    )
    .eq("user_id", userId);

  if (error) throw error;
  return sortPredictionsByMatchSchedule(
    (data ?? []) as unknown as PredictionWithMatch[]
  );
}

export function buildPointsChart(
  predictions: PredictionWithMatch[]
): PointsChartPoint[] {
  const finished = predictions
    .filter(
      (p) =>
        p.match?.status === "finished" &&
        p.points_earned > 0 &&
        p.match.scheduled_at
    )
    .sort(
      (a, b) =>
        new Date(a.match.scheduled_at).getTime() -
        new Date(b.match.scheduled_at).getTime()
    );

  let cumulative = 0;
  return finished.map((p) => {
    cumulative += p.points_earned;
    const d = new Date(p.match.scheduled_at);
    return {
      date: p.match.scheduled_at,
      label: d.toLocaleDateString("es", { day: "numeric", month: "short" }),
      earned: p.points_earned,
      cumulative,
    };
  });
}
