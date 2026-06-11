import { createServiceClient } from "@/lib/supabase/server";
import {
  fetchWorldCupFixtures,
  parseFixtureStatus,
  type ApiFootballFixture,
} from "@/lib/api-football";
import { calculatePointsForMatch } from "@/lib/points-service";

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
    return { synced: 0, pointsCalculated: 0 };
  }

  let apiFixtures: ApiFootballFixture[] = [];
  try {
    apiFixtures = await fetchWorldCupFixtures();
  } catch (e) {
    console.warn("API-Football no disponible:", e);
    return { synced: 0, pointsCalculated: 0, error: String(e) };
  }

  let synced = 0;
  let pointsCalculated = 0;

  for (const match of matches) {
    const fixture = findMatchingFixture(match, apiFixtures);
    if (!fixture) continue;

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

    if (status === "finished" && homeScore !== null && awayScore !== null) {
      const result = await calculatePointsForMatch(match.id);
      pointsCalculated += result.updated;
    }
  }

  return { synced, pointsCalculated };
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

  const matchDate = new Date(match.scheduled_at).toISOString().slice(0, 10);

  return fixtures.find((f) => {
    const fixtureDate = new Date(f.fixture.date).toISOString().slice(0, 10);
    return fixtureDate === matchDate;
  });
}
