import { createServiceClient } from "@/lib/supabase/server";
import {
  fetchFixturesByDate,
  isWorldCupFixture,
  parseFixtureStatus,
  type ApiFootballFixture,
} from "@/lib/api-football";
import { calculatePointsForMatch } from "@/lib/points-service";
import { recordResultsSync, touchMatchResultsUpdated } from "@/lib/sync-meta";
import { apiTeamNameToCode } from "@/lib/team-api-aliases";
import {
  DEFAULT_TIMEZONE,
  formatCalendarDayInTimezone,
} from "@/lib/timezone";

interface DbMatch {
  id: number;
  external_id: number | null;
  scheduled_at: string;
  status: string;
  home_team: { code: string; external_id: number | null };
  away_team: { code: string; external_id: number | null };
}

const SYNC_WINDOW_DAYS = 3;
const MAX_API_DATES = 5;
const API_CONCURRENCY = 3;

export async function syncMatchResults() {
  const supabase = createServiceClient();
  const now = new Date();
  const windowStart = new Date(now.getTime() - SYNC_WINDOW_DAYS * 86400000);
  const windowEnd = new Date(now.getTime() + SYNC_WINDOW_DAYS * 86400000);

  const { data: dbMatches, error } = await supabase
    .from("matches")
    .select(
      `
      id, external_id, scheduled_at, status,
      home_team:teams!matches_home_team_id_fkey(code, external_id),
      away_team:teams!matches_away_team_id_fkey(code, external_id)
    `
    )
    .gte("scheduled_at", windowStart.toISOString())
    .lte("scheduled_at", windowEnd.toISOString());

  if (error) throw error;

  const matches = ((dbMatches ?? []) as unknown as DbMatch[]).filter(
    (m) => m.home_team.code !== "TBD" && m.away_team.code !== "TBD"
  );

  if (matches.length === 0) {
    return {
      synced: 0,
      schedulesUpdated: 0,
      pointsCalculated: 0,
      pending: 0,
      fixturesFound: 0,
    };
  }

  const fetchDates = collectFetchDates(matches, now);
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

    const hasResultUpdate =
      status !== "upcoming" &&
      (match.status !== status ||
        homeScore !== null ||
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
    datesFetched: fetchDates.length,
  };
}

function collectFetchDates(_matches: DbMatch[], reference: Date): string[] {
  const dates: string[] = [];
  for (const offset of [-1, 0, 1]) {
    const d = new Date(reference.getTime() + offset * 86400000);
    dates.push(formatCalendarDayInTimezone(d, DEFAULT_TIMEZONE));
  }
  return dates.slice(0, MAX_API_DATES);
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
  if (match.home_team.external_id && match.away_team.external_id) {
    const byTeamId = fixtures.find(
      (f) =>
        f.teams.home.id === match.home_team.external_id &&
        f.teams.away.id === match.away_team.external_id
    );
    if (byTeamId) return byTeamId;
  }

  const homeCode = match.home_team.code;
  const awayCode = match.away_team.code;

  return fixtures.find((f) => {
    const fHome = apiTeamNameToCode(f.teams.home.name);
    const fAway = apiTeamNameToCode(f.teams.away.name);
    return fHome === homeCode && fAway === awayCode;
  });
}
