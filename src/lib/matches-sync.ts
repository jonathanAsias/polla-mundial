import { createServiceClient } from "@/lib/supabase/server";
import {
  fetchFixturesByDate,
  getFixturePenaltyScores,
  getFixtureWinnerSide,
  isWorldCupFixture,
  parseFixtureStatus,
  type ApiFootballFixture,
} from "@/lib/api-football";
import { calculatePointsForMatch } from "@/lib/points-service";
import { recordResultsSync, touchMatchResultsUpdated } from "@/lib/sync-meta";
import { apiTeamNameToCode } from "@/lib/team-api-aliases";
import {
  getExternalIdsForFifaDay,
  getFifaMatchDay,
  isTournamentCalendarDay,
} from "@/data/fifa-match-days";
import {
  formatFifaCalendarDay,
  getTournamentCalendarDay,
} from "@/lib/timezone";

interface DbMatch {
  id: number;
  external_id: number | null;
  scheduled_at: string;
  status: string;
  home_team: { code: string; external_id: number | null };
  away_team: { code: string; external_id: number | null };
}

const API_CONCURRENCY = 3;

export async function syncMatchResults() {
  const supabase = createServiceClient();
  const tournamentDay = getTournamentCalendarDay();

  if (!tournamentDay) {
    return {
      synced: 0,
      schedulesUpdated: 0,
      pointsCalculated: 0,
      pending: 0,
      fixturesFound: 0,
      calendarDay: null,
    };
  }

  const fetchDates = collectTournamentFetchDates(tournamentDay);
  const dayExternalIds = fetchDates.flatMap((d) => getExternalIdsForFifaDay(d));
  const uniqueExternalIds = Array.from(new Set(dayExternalIds));

  const { data: dbMatches, error } = await supabase
    .from("matches")
    .select(
      `
      id, external_id, scheduled_at, status,
      home_team:teams!matches_home_team_id_fkey(code, external_id),
      away_team:teams!matches_away_team_id_fkey(code, external_id)
    `
    )
    .in("external_id", uniqueExternalIds);

  if (error) throw error;

  const matches = (dbMatches ?? []) as unknown as DbMatch[];

  if (matches.length === 0) {
    return {
      synced: 0,
      schedulesUpdated: 0,
      pointsCalculated: 0,
      pending: 0,
      fixturesFound: 0,
      calendarDay: tournamentDay,
    };
  }

  let apiFixtures: ApiFootballFixture[] = [];

  try {
    apiFixtures = await fetchWorldCupFixturesParallel(fetchDates);
  } catch (e) {
    console.warn("API-Football no disponible:", e);
    return {
      synced: 0,
      schedulesUpdated: 0,
      pointsCalculated: 0,
      pending: matches.length,
      fixturesFound: 0,
      calendarDay: tournamentDay,
      error: String(e),
    };
  }

  let synced = 0;
  let schedulesUpdated = 0;
  let pointsCalculated = 0;
  let unmatched = 0;
  const finishedMatchIds: number[] = [];

  for (const match of matches) {
    const fixture = findMatchingFixture(match, apiFixtures);
    if (!fixture) {
      unmatched++;
      continue;
    }

    const status = parseFixtureStatus(fixture.fixture.status.short);
    const homeScore = fixture.goals.home;
    const awayScore = fixture.goals.away;
    const winnerSide = getFixtureWinnerSide(fixture);
    const penaltyScores = getFixturePenaltyScores(fixture);
    const apiKickoff = new Date(fixture.fixture.date).toISOString();
    const kickoffChanged = apiKickoff !== new Date(match.scheduled_at).toISOString();

    const update: Record<string, unknown> = { scheduled_at: apiKickoff };

    if (status !== "upcoming") {
      update.status = status;
    } else if (match.status === "upcoming") {
      update.status = "upcoming";
    }

    if (homeScore !== null && awayScore !== null) {
      update.home_score = homeScore;
      update.away_score = awayScore;
    }

    if (status === "finished") {
      update.winner_side = winnerSide;
      if (penaltyScores.home !== null && penaltyScores.away !== null) {
        update.home_penalties = penaltyScores.home;
        update.away_penalties = penaltyScores.away;
      } else {
        update.home_penalties = null;
        update.away_penalties = null;
      }
    }

    const hasResultUpdate =
      status !== "upcoming" &&
      (match.status !== status ||
        homeScore !== null ||
        winnerSide !== null ||
        penaltyScores.home !== null ||
        kickoffChanged);

    if (!kickoffChanged && !hasResultUpdate) continue;

    const { error: updateError } = await supabase
      .from("matches")
      .update(update)
      .eq("id", match.id);

    if (updateError) continue;

    if (kickoffChanged) schedulesUpdated++;
    if (hasResultUpdate) synced++;

    if (homeScore !== null && awayScore !== null && status !== "upcoming") {
      await touchMatchResultsUpdated(match.id);
    }

    if (status === "finished" && homeScore !== null && awayScore !== null) {
      finishedMatchIds.push(match.id);
    }
  }

  const pointsResults = await Promise.all(
    finishedMatchIds.map((matchId) => calculatePointsForMatch(matchId))
  );
  pointsCalculated = pointsResults.reduce((sum, r) => sum + r.updated, 0);

  if (synced > 0 || schedulesUpdated > 0) {
    await recordResultsSync("API-Football");
  }

  return {
    synced,
    schedulesUpdated,
    pointsCalculated,
    pending: matches.length,
    fixturesFound: apiFixtures.length,
    unmatched,
    datesFetched: fetchDates,
    calendarDay: tournamentDay,
  };
}

/** Días calendario FIFA a consultar: ayer, hoy y mañana del torneo. */
function collectTournamentFetchDates(tournamentDay: string): string[] {
  const dates = new Set<string>([tournamentDay]);

  const prev = shiftCalendarDay(tournamentDay, -1);
  const next = shiftCalendarDay(tournamentDay, 1);

  if (prev && isTournamentCalendarDay(prev)) dates.add(prev);
  if (next && isTournamentCalendarDay(next)) dates.add(next);

  return Array.from(dates).sort();
}

function shiftCalendarDay(day: string, offset: number): string | null {
  const [year, month, date] = day.split("-").map(Number);
  const utc = new Date(Date.UTC(year, month - 1, date));
  utc.setUTCDate(utc.getUTCDate() + offset);
  return formatFifaCalendarDay(utc);
}

async function fetchWorldCupFixturesParallel(
  dates: string[]
): Promise<ApiFootballFixture[]> {
  const fixtures: ApiFootballFixture[] = [];

  for (let i = 0; i < dates.length; i += API_CONCURRENCY) {
    const batch = dates.slice(i, i + API_CONCURRENCY);
    const results = await Promise.all(
      batch.map(async (date) => {
        const dayFixtures = await fetchFixturesByDate(date);
        return dayFixtures.filter(isWorldCupFixture);
      })
    );
    fixtures.push(...results.flat());
  }

  return fixtures;
}

function findMatchingFixture(
  match: DbMatch,
  fixtures: ApiFootballFixture[]
): ApiFootballFixture | undefined {
  if (match.external_id) {
    const fifaDay = getFifaMatchDay(match.external_id);
    const dayFixtures =
      fifaDay != null
        ? fixtures.filter((f) => {
            const kickoffDay = formatFifaCalendarDay(new Date(f.fixture.date));
            return kickoffDay === fifaDay || isSameTeams(match, f);
          })
        : fixtures;

    const byTeams = dayFixtures.find((f) => isSameTeams(match, f));
    if (byTeams) return byTeams;
  }

  if (match.home_team.external_id && match.away_team.external_id) {
    const byTeamId = fixtures.find(
      (f) =>
        f.teams.home.id === match.home_team.external_id &&
        f.teams.away.id === match.away_team.external_id
    );
    if (byTeamId) return byTeamId;
  }

  return fixtures.find((f) => isSameTeams(match, f));
}

function isSameTeams(match: DbMatch, fixture: ApiFootballFixture): boolean {
  const homeCode = match.home_team.code;
  const awayCode = match.away_team.code;
  if (homeCode === "TBD" || awayCode === "TBD") return false;

  const fHome = apiTeamNameToCode(fixture.teams.home.name);
  const fAway = apiTeamNameToCode(fixture.teams.away.name);
  return fHome === homeCode && fAway === awayCode;
}
