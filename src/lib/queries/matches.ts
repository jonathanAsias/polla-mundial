import { createClient } from "@/lib/supabase/server";
import type { MatchPhase, MatchStatus } from "@/types/database";
export interface MatchWithTeams {
  id: number;
  phase: MatchPhase;
  scheduled_at: string;
  home_score: number | null;
  away_score: number | null;
  status: MatchStatus;
  external_id: number | null;
  venue: string | null;
  city: string | null;
  home_team: { id: number; name: string; code: string; flag_emoji: string | null };
  away_team: { id: number; name: string; code: string; flag_emoji: string | null };
}

export async function getMatchesByPhase(phase: MatchPhase) {
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
    .eq("phase", phase)
    .order("scheduled_at", { ascending: true });

  if (error) throw error;
  return (data ?? []) as unknown as MatchWithTeams[];
}

export async function getAllMatches() {
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
    .order("scheduled_at", { ascending: true });

  if (error) throw error;
  return (data ?? []) as unknown as MatchWithTeams[];
}
