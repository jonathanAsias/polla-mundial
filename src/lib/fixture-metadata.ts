import type { ApiFootballFixture } from "@/lib/api-football";
import {
  getFixturePenaltyScores,
  getFixtureWinnerSide,
  parseFixtureStatus,
} from "@/lib/api-football";

export interface FixtureResultMetadata {
  home_score: number | null;
  away_score: number | null;
  status: "upcoming" | "live" | "finished";
  winner_side: "home" | "away" | null;
  home_penalties: number | null;
  away_penalties: number | null;
  fixture_status_short: string | null;
}

export function buildFixtureResultMetadata(
  fixture: ApiFootballFixture
): FixtureResultMetadata {
  const statusShort = fixture.fixture.status.short;
  const status = parseFixtureStatus(statusShort);
  const winnerSide = getFixtureWinnerSide(fixture);
  const penaltyScores = getFixturePenaltyScores(fixture);

  return {
    home_score: fixture.goals.home,
    away_score: fixture.goals.away,
    status,
    winner_side: status === "finished" ? winnerSide : null,
    home_penalties: penaltyScores.home,
    away_penalties: penaltyScores.away,
    fixture_status_short: status === "finished" ? statusShort : null,
  };
}

export function isPenaltyShootoutStatus(statusShort: string | null | undefined): boolean {
  return statusShort === "PEN";
}
