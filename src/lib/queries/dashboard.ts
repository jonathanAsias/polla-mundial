import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import type { MatchWithTeams } from "@/lib/queries/matches";
import type { Prediction } from "@/types/database";
import { getExternalIdsForFifaDay } from "@/data/fifa-match-days";
import {
  enrichMatchesWithKnockoutTeams,
  getFeederExternalIdsForMatches,
  type MatchForBracket,
} from "@/lib/knockout-bracket";
import {
  formatFifaCalendarDay,
  getTournamentCalendarDay,
  DEFAULT_TIMEZONE,
} from "@/lib/timezone";
import { getPredictionDeadline, isPredictionLocked } from "@/lib/predictions";

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

export async function getTodayJornadaMatches(
  timeZone = DEFAULT_TIMEZONE,
  supabaseClient?: SupabaseClient
): Promise<MatchWithTeams[]> {
  void timeZone;
  const supabase = supabaseClient ?? (await createClient());
  const tournamentDay = getTournamentCalendarDay();

  if (!tournamentDay) return [];

  const externalIds = getExternalIdsForFifaDay(tournamentDay);
  if (externalIds.length === 0) return [];

  const { data, error } = await supabase
    .from("matches")
    .select(MATCH_SELECT)
    .in("external_id", externalIds)
    .order("scheduled_at", { ascending: true });

  if (error) throw error;

  const matches = (data ?? []) as unknown as MatchWithTeams[];
  return enrichMatchesWithResolvedKnockoutTeams(matches, supabase);
}

export function getTodayFifaCalendarLabel(): string {
  return formatFifaCalendarDay();
}

/** Partidos eliminatorios próximos (32avos en adelante) con equipos definidos. */
export async function getUpcomingKnockoutMatches(
  supabaseClient?: SupabaseClient
): Promise<MatchWithTeams[]> {
  const supabase = supabaseClient ?? (await createClient());
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("matches")
    .select(MATCH_SELECT)
    .neq("phase", "group")
    .in("status", ["upcoming", "live"])
    .gte("scheduled_at", now)
    .order("scheduled_at", { ascending: true });

  if (error) throw error;

  const matches = (data ?? []) as unknown as MatchWithTeams[];
  const enriched = await enrichMatchesWithResolvedKnockoutTeams(matches, supabase);

  return enriched.filter(
    (m) => m.home_team.code !== "TBD" && m.away_team.code !== "TBD"
  );
}

/** @deprecated Use getTodayJornadaMatches */
export async function getDashboardMatches(): Promise<MatchWithTeams[]> {
  const today = await getTodayJornadaMatches();
  if (today.length > 0) return today;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("matches")
    .select(MATCH_SELECT)
    .in("status", ["upcoming", "live"])
    .gte("scheduled_at", new Date().toISOString())
    .order("scheduled_at", { ascending: true })
    .limit(3);

  if (error) throw error;
  return (data ?? []) as unknown as MatchWithTeams[];
}

export interface MatchReminder {
  matchId: number;
  homeTeam: string;
  awayTeam: string;
  scheduledAt: string;
  deadlineAt: string;
  locked: boolean;
  hasPrediction: boolean;
}

export async function getMatchRemindersForUser(
  userId: string,
  timeZone = DEFAULT_TIMEZONE,
  supabaseClient?: SupabaseClient
): Promise<MatchReminder[]> {
  const supabase = supabaseClient ?? (await createClient());
  const matches = await getTodayJornadaMatches(timeZone, supabase);
  const predictable = matches.filter(
    (m) => m.home_team.code !== "TBD" && m.away_team.code !== "TBD"
  );
  if (predictable.length === 0) return [];

  const predictions = await getUserPredictionsForMatches(
    userId,
    predictable.map((m) => m.id),
    supabase
  );

  return predictable.map((match) => ({
    matchId: match.id,
    homeTeam: match.home_team.name,
    awayTeam: match.away_team.name,
    scheduledAt: match.scheduled_at,
    deadlineAt: getPredictionDeadline(match.scheduled_at).toISOString(),
    locked: isPredictionLocked(match.scheduled_at, match.status),
    hasPrediction: predictions[match.id] !== undefined,
  }));
}

export async function getUserPredictionsForMatches(
  userId: string,
  matchIds: number[],
  supabaseClient?: SupabaseClient
): Promise<Record<number, Prediction>> {
  if (matchIds.length === 0) return {};

  const supabase = supabaseClient ?? (await createClient());
  const { data, error } = await supabase
    .from("predictions")
    .select("*")
    .eq("user_id", userId)
    .in("match_id", matchIds)
    .returns<Prediction[]>();

  if (error) throw error;

  return Object.fromEntries((data ?? []).map((p) => [p.match_id, p]));
}

export { getRanking as getTopRanking } from "@/lib/queries/ranking";
