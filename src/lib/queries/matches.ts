import { createClient } from "@/lib/supabase/server";
import type { MatchPhase, MatchStatus } from "@/types/database";
import {
  enrichMatchesWithKnockoutTeams,
  getFeederExternalIdsForMatches,
  type MatchForBracket,
} from "@/lib/knockout-bracket";
import type { SupabaseClient } from "@supabase/supabase-js";

export interface MatchTeamWithGroup {
  id: number;
  name: string;
  code: string;
  flag_emoji: string | null;
  group_name: string | null;
}

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
  home_team: MatchTeamWithGroup;
  away_team: MatchTeamWithGroup;
}

const MATCH_SELECT = `
  id, phase, scheduled_at, home_score, away_score, status, external_id, venue, city,
  home_team:teams!matches_home_team_id_fkey(id, name, code, flag_emoji, group_name),
  away_team:teams!matches_away_team_id_fkey(id, name, code, flag_emoji, group_name)
`;

const FEEDER_MATCH_SELECT = `
  id, external_id, status, winner_side, home_score, away_score, home_team_id, away_team_id,
  home_team:teams!matches_home_team_id_fkey(id, name, code, flag_emoji, group_name),
  away_team:teams!matches_away_team_id_fkey(id, name, code, flag_emoji, group_name)
`;

async function enrichMatchesWithResolvedKnockoutTeams(
  matches: MatchWithTeams[],
  supabaseClient?: SupabaseClient
): Promise<MatchWithTeams[]> {
  const feederIds = getFeederExternalIdsForMatches(matches);
  if (feederIds.length === 0) return matches;

  const supabase = supabaseClient ?? (await createClient());
  const { data, error } = await supabase
    .from("matches")
    .select(FEEDER_MATCH_SELECT)
    .in("external_id", feederIds);

  if (error) throw error;

  return enrichMatchesWithKnockoutTeams(
    matches,
    (data ?? []) as unknown as MatchForBracket[]
  );
}

export async function getMatchesByPhase(phase: MatchPhase) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("matches")
    .select(MATCH_SELECT)
    .eq("phase", phase)
    .order("scheduled_at", { ascending: true });

  if (error) throw error;
  const matches = (data ?? []) as unknown as MatchWithTeams[];
  return enrichMatchesWithResolvedKnockoutTeams(matches, supabase);
}

export async function getAllMatches() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("matches")
    .select(MATCH_SELECT)
    .order("scheduled_at", { ascending: true });

  if (error) throw error;
  const matches = (data ?? []) as unknown as MatchWithTeams[];
  return enrichMatchesWithResolvedKnockoutTeams(matches, supabase);
}
