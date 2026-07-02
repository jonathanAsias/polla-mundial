import { createServiceClient } from "@/lib/supabase/server";
import {
  fetchFixturesByDate,
  isWorldCupFixture,
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
import { buildFixtureResultMetadata } from "@/lib/fixture-metadata";
import {
  formatFifaCalendarDay,
  getTournamentCalendarDay,
} from "@/lib/timezone";

interface DbMatch {
  id: number;
  external_id: number | null;
  scheduled_at: string;
  status: string;
  home_score: number | null;
  away_score: number | null;
  winner_side: string | null;
  home_penalties: number | null;
  away_penalties: number | null;
  fixture_status_short: string | null;
  home_team: { code: string; external_id: number | null };
  away_team: { code: string; external_id: number | null };
}

const API_CONCURRENCY = 3;

const MATCH_SELECT = `
  id, external_id, scheduled_at, status, home_score, away_score,
  winner_side, home_penalties, away_penalties, fixture_status_short,
  home_team:teams!matches_home_team_id_fkey(code, external_id),
  away_team:teams!matches_away_team_id_fkey(code, external_id)
`;

export async function syncMatchResults() {
  const window = await syncMatchesWindow();
  const backfill = await backfillFinishedMatchesFromApi();

  const pointsResults = await Promise.all(
    backfill.recalculatedMatchIds.map((matchId) =>
      calculatePointsForMatch(matchId)
    )
  );
  const backfillPoints = pointsResults.reduce((sum, r) => sum + r.updated, 0);

  if (
    window.synced > 0 ||
    window.schedulesUpdated > 0 ||
    backfill.updated > 0
  ) {
    await recordResultsSync("API-Football");
  }

  return {
    ...window,
    pointsCalculated: window.pointsCalculated + backfillPoints,
    backfillUpdated: backfill.updated,
    backfillFixtures: backfill.fixturesFound,
  };
}

async function syncMatchesWindow() {
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
    .select(MATCH_SELECT)
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

  return applyFixturesToMatches(matches, apiFixtures, tournamentDay);
}

/** Repuebla metadatos de TODOS los partidos finalizados (penales, ganador). */
export async function backfillFinishedMatchesFromApi() {
  const supabase = createServiceClient();

  const { data: dbMatches, error } = await supabase
    .from("matches")
    .select(MATCH_SELECT)
    .eq("status", "finished");

  if (error) throw error;

  const matches = (dbMatches ?? []) as unknown as DbMatch[];
  if (matches.length === 0) {
    return { updated: 0, fixturesFound: 0, recalculatedMatchIds: [] as number[] };
  }

  const fetchDates = Array.from(
    new Set(
      matches
        .map((m) => (m.external_id ? getFifaMatchDay(m.external_id) : null))
        .filter((d): d is string => Boolean(d))
    )
  ).sort();

  let apiFixtures: ApiFootballFixture[] = [];
  try {
    apiFixtures = await fetchWorldCupFixturesParallel(fetchDates);
  } catch (e) {
    console.warn("Backfill API-Football no disponible:", e);
    return { updated: 0, fixturesFound: 0, recalculatedMatchIds: [] as number[] };
  }

  let updated = 0;
  const recalculatedMatchIds: number[] = [];

  for (const match of matches) {
    const fixture = findMatchingFixture(match, apiFixtures);
    if (!fixture) continue;

    const metadata = buildFixtureResultMetadata(fixture);
    if (metadata.status !== "finished") continue;

    const changed = matchNeedsMetadataUpdate(match, metadata);
    if (!changed) continue;

    const { error: updateError } = await supabase
      .from("matches")
      .update({
        home_score: metadata.home_score,
        away_score: metadata.away_score,
        status: metadata.status,
        winner_side: metadata.winner_side,
        home_penalties: metadata.home_penalties,
        away_penalties: metadata.away_penalties,
        fixture_status_short: metadata.fixture_status_short,
      })
      .eq("id", match.id);

    if (updateError) {
      console.warn(`Backfill partido ${match.id}:`, updateError.message);
      continue;
    }

    updated++;
    recalculatedMatchIds.push(match.id);
    await touchMatchResultsUpdated(match.id);
  }

  return {
    updated,
    fixturesFound: apiFixtures.length,
    recalculatedMatchIds,
  };
}

function matchNeedsMetadataUpdate(
  match: DbMatch,
  metadata: ReturnType<typeof buildFixtureResultMetadata>
): boolean {
  return (
    match.winner_side !== metadata.winner_side ||
    match.home_penalties !== metadata.home_penalties ||
    match.away_penalties !== metadata.away_penalties ||
    match.fixture_status_short !== metadata.fixture_status_short ||
    match.home_score !== metadata.home_score ||
    match.away_score !== metadata.away_score
  );
}

async function applyFixturesToMatches(
  matches: DbMatch[],
  apiFixtures: ApiFootballFixture[],
  calendarDay: string | null
) {
  const supabase = createServiceClient();
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

    const metadata = buildFixtureResultMetadata(fixture);
    const apiKickoff = new Date(fixture.fixture.date).toISOString();
    const kickoffChanged = apiKickoff !== new Date(match.scheduled_at).toISOString();

    const update: Record<string, unknown> = { scheduled_at: apiKickoff };

    if (metadata.status !== "upcoming") {
      update.status = metadata.status;
    } else if (match.status === "upcoming") {
      update.status = "upcoming";
    }

    if (metadata.home_score !== null && metadata.away_score !== null) {
      update.home_score = metadata.home_score;
      update.away_score = metadata.away_score;
    }

    if (metadata.status === "finished") {
      update.winner_side = metadata.winner_side;
      update.home_penalties = metadata.home_penalties;
      update.away_penalties = metadata.away_penalties;
      update.fixture_status_short = metadata.fixture_status_short;
    }

    const metadataChanged = matchNeedsMetadataUpdate(match, metadata);
    const hasResultUpdate =
      metadata.status !== "upcoming" &&
      (match.status !== metadata.status || metadataChanged || kickoffChanged);

    if (!kickoffChanged && !hasResultUpdate) continue;

    const { error: updateError } = await supabase
      .from("matches")
      .update(update)
      .eq("id", match.id);

    if (updateError) continue;

    if (kickoffChanged) schedulesUpdated++;
    if (hasResultUpdate) synced++;

    if (
      metadata.home_score !== null &&
      metadata.away_score !== null &&
      metadata.status !== "upcoming"
    ) {
      await touchMatchResultsUpdated(match.id);
    }

    if (
      metadata.status === "finished" &&
      metadata.home_score !== null &&
      metadata.away_score !== null
    ) {
      finishedMatchIds.push(match.id);
    }
  }

  const pointsResults = await Promise.all(
    finishedMatchIds.map((matchId) => calculatePointsForMatch(matchId))
  );
  pointsCalculated = pointsResults.reduce((sum, r) => sum + r.updated, 0);

  return {
    synced,
    schedulesUpdated,
    pointsCalculated,
    pending: matches.length,
    fixturesFound: apiFixtures.length,
    unmatched,
    datesFetched: [],
    calendarDay,
  };
}

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
