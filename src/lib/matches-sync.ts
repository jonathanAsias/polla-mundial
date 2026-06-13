import { createServiceClient } from "@/lib/supabase/server";
import {
  fetchWorldCupFixturesForDates,
  parseFixtureStatus,
  type ApiFootballFixture,
} from "@/lib/api-football";
import { calculatePointsForMatch } from "@/lib/points-service";
import { recordResultsSync, touchMatchResultsUpdated } from "@/lib/sync-meta";
import { apiTeamNameToCode } from "@/lib/team-api-aliases";

interface DbMatch {
  id: number;
  external_id: number | null;
  scheduled_at: string;
  status: string;
  home_team_id: number;
  away_team_id: number;
  home_team: { code: string; external_id: number | null };
  away_team: { code: string; external_id: number | null };
}

export async function syncMatchResults() {
  const supabase = createServiceClient();
  const now = new Date().toISOString();

  const { data: dbMatches, error } = await supabase
    .from("matches")
    .select(
      `
      id, external_id, scheduled_at, status, home_team_id, away_team_id,
      home_team:teams!matches_home_team_id_fkey(code, external_id),
      away_team:teams!matches_away_team_id_fkey(code, external_id)
    `
    )
    .in("status", ["upcoming", "live"])
    .lte("scheduled_at", now);

  if (error) throw error;

  const matches = (dbMatches ?? []) as unknown as DbMatch[];
  if (matches.length === 0) {
    return { synced: 0, pointsCalculated: 0, pending: 0, fixturesFound: 0 };
  }

  const dates = matches.map((m) =>
    new Date(m.scheduled_at).toISOString().slice(0, 10)
  );

  let apiFixtures: ApiFootballFixture[] = [];
  try {
    apiFixtures = await fetchWorldCupFixturesForDates(dates);
  } catch (e) {
    console.warn("API-Football no disponible:", e);
    return {
      synced: 0,
      pointsCalculated: 0,
      pending: matches.length,
      fixturesFound: 0,
      error: String(e),
    };
  }

  let synced = 0;
  let pointsCalculated = 0;
  let unmatched = 0;

  for (const match of matches) {
    const fixture = findMatchingFixture(match, apiFixtures);
    if (!fixture) {
      unmatched++;
      continue;
    }

    const status = parseFixtureStatus(fixture.fixture.status.short);
    const homeScore = fixture.goals.home;
    const awayScore = fixture.goals.away;

    if (status === "upcoming") continue;

    const update: Record<string, unknown> = { status };
    if (homeScore !== null && awayScore !== null) {
      update.home_score = homeScore;
      update.away_score = awayScore;
    }

    const { error: updateError } = await supabase
      .from("matches")
      .update(update)
      .eq("id", match.id);

    if (updateError) continue;

    synced++;

    if (homeScore !== null && awayScore !== null) {
      await touchMatchResultsUpdated(match.id);
    }

    if (status === "finished" && homeScore !== null && awayScore !== null) {
      const result = await calculatePointsForMatch(match.id);
      pointsCalculated += result.updated;
    }
  }

  if (synced > 0) {
    await recordResultsSync("API-Football");
  }

  return {
    synced,
    pointsCalculated,
    pending: matches.length,
    fixturesFound: apiFixtures.length,
    unmatched,
  };
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
