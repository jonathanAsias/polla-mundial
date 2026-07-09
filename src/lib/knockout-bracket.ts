import { KNOCKOUT_LABELS } from "@/data/matches";
import { resolveActualWinner } from "@/lib/points";
import type { MatchTeamWithGroup, MatchWithTeams } from "@/lib/queries/matches";
import type { MatchWinnerSide } from "@/types/database";

type AdvanceSide = "winner" | "loser";

interface BracketSlot {
  fromExternalId: number;
  side: AdvanceSide;
}

export interface KnockoutBracketEntry {
  externalId: number;
  home: BracketSlot;
  away: BracketSlot;
}

const WINNER_LABEL = /Ganador (\d+) vs Ganador (\d+)/;

function parseWinnerLabel(label: string): [number, number] | null {
  const match = label.match(WINNER_LABEL);
  if (!match) return null;
  return [Number(match[1]), Number(match[2])];
}

function buildKnockoutBracket(): KnockoutBracketEntry[] {
  const entries: KnockoutBracketEntry[] = [];

  for (const [externalIdStr, label] of Object.entries(KNOCKOUT_LABELS)) {
    const externalId = Number(externalIdStr);
    const parsed = parseWinnerLabel(label);
    if (parsed) {
      entries.push({
        externalId,
        home: { fromExternalId: parsed[0], side: "winner" },
        away: { fromExternalId: parsed[1], side: "winner" },
      });
      continue;
    }

    if (label === "Final") {
      entries.push({
        externalId,
        home: { fromExternalId: 101, side: "winner" },
        away: { fromExternalId: 102, side: "winner" },
      });
      continue;
    }

    if (label === "Tercer puesto") {
      entries.push({
        externalId,
        home: { fromExternalId: 101, side: "loser" },
        away: { fromExternalId: 102, side: "loser" },
      });
    }
  }

  return entries;
}

export const KNOCKOUT_BRACKET = buildKnockoutBracket();

const BRACKET_BY_EXTERNAL_ID = new Map(
  KNOCKOUT_BRACKET.map((entry) => [entry.externalId, entry])
);

export interface MatchForBracket {
  id: number;
  external_id: number | null;
  status: string;
  winner_side: MatchWinnerSide | null;
  home_score: number | null;
  away_score: number | null;
  home_team_id: number;
  away_team_id: number;
  home_team: MatchTeamWithGroup;
  away_team: MatchTeamWithGroup;
}

function isTbdTeam(team: MatchTeamWithGroup): boolean {
  return team.code === "TBD";
}

function getAdvancingTeam(
  match: MatchForBracket,
  side: AdvanceSide
): MatchTeamWithGroup | null {
  if (match.status !== "finished") return null;
  if (match.home_score === null || match.away_score === null) return null;

  const winner = resolveActualWinner(
    match.home_score,
    match.away_score,
    match.winner_side
  );

  if (winner === "draw") return null;

  const winnerTeam =
    winner === "home" ? match.home_team : match.away_team;
  const loserTeam =
    winner === "home" ? match.away_team : match.home_team;

  return side === "winner" ? winnerTeam : loserTeam;
}

function resolveFeederTeams(
  match: MatchForBracket,
  byExternalId: Map<number, MatchForBracket>
): { home: MatchTeamWithGroup; away: MatchTeamWithGroup } | null {
  const entry = match.external_id
    ? BRACKET_BY_EXTERNAL_ID.get(match.external_id)
    : undefined;
  if (!entry) return null;

  const home = isTbdTeam(match.home_team)
    ? resolveBracketTeam(entry.home, byExternalId)
    : match.home_team;
  const away = isTbdTeam(match.away_team)
    ? resolveBracketTeam(entry.away, byExternalId)
    : match.away_team;

  if (!home || !away) return null;
  return { home, away };
}

function resolveBracketTeam(
  slot: BracketSlot,
  byExternalId: Map<number, MatchForBracket>
): MatchTeamWithGroup | null {
  const feeder = byExternalId.get(slot.fromExternalId);
  if (!feeder) return null;

  if (isTbdTeam(feeder.home_team) || isTbdTeam(feeder.away_team)) {
    const teams = resolveFeederTeams(feeder, byExternalId);
    if (!teams) return null;
    return getAdvancingTeam(
      { ...feeder, home_team: teams.home, away_team: teams.away },
      slot.side
    );
  }

  return getAdvancingTeam(feeder, slot.side);
}

export function resolveKnockoutTeams(
  match: MatchWithTeams,
  byExternalId: Map<number, MatchForBracket>
): MatchWithTeams {
  if (!match.external_id) return match;
  if (!isTbdTeam(match.home_team) && !isTbdTeam(match.away_team)) {
    return match;
  }

  const entry = BRACKET_BY_EXTERNAL_ID.get(match.external_id);
  if (!entry) return match;

  const homeTeam = isTbdTeam(match.home_team)
    ? resolveBracketTeam(entry.home, byExternalId)
    : match.home_team;
  const awayTeam = isTbdTeam(match.away_team)
    ? resolveBracketTeam(entry.away, byExternalId)
    : match.away_team;

  if (!homeTeam && !awayTeam) return match;

  return {
    ...match,
    home_team: homeTeam ?? match.home_team,
    away_team: awayTeam ?? match.away_team,
  };
}

export function enrichMatchesWithKnockoutTeams(
  matches: MatchWithTeams[],
  feederMatches: MatchForBracket[]
): MatchWithTeams[] {
  if (matches.length === 0 || feederMatches.length === 0) return matches;

  const byExternalId = new Map<number, MatchForBracket>();
  for (const match of feederMatches) {
    if (match.external_id != null) {
      byExternalId.set(match.external_id, match);
    }
  }

  return matches.map((match) => resolveKnockoutTeams(match, byExternalId));
}

function collectTransitiveFeederIds(
  externalId: number,
  visited = new Set<number>()
): number[] {
  if (visited.has(externalId)) return [];
  visited.add(externalId);

  const entry = BRACKET_BY_EXTERNAL_ID.get(externalId);
  if (!entry) return [];

  const direct = [entry.home.fromExternalId, entry.away.fromExternalId];
  return [
    ...direct,
    ...direct.flatMap((id) => collectTransitiveFeederIds(id, visited)),
  ];
}

export function getFeederExternalIdsForMatches(
  matches: Pick<MatchWithTeams, "external_id" | "home_team" | "away_team">[]
): number[] {
  const ids = new Set<number>();

  for (const match of matches) {
    if (!match.external_id) continue;
    if (!isTbdTeam(match.home_team) && !isTbdTeam(match.away_team)) {
      continue;
    }

    for (const feederId of collectTransitiveFeederIds(match.external_id)) {
      ids.add(feederId);
    }
  }

  return Array.from(ids);
}

export function getKnockoutPropagationUpdates(
  matches: MatchForBracket[]
): Array<{
  matchId: number;
  externalId: number;
  homeTeamId: number;
  awayTeamId: number;
}> {
  const byExternalId = new Map<number, MatchForBracket>();
  for (const match of matches) {
    if (match.external_id != null) {
      byExternalId.set(match.external_id, match);
    }
  }

  const updates: Array<{
    matchId: number;
    externalId: number;
    homeTeamId: number;
    awayTeamId: number;
  }> = [];

  for (const entry of KNOCKOUT_BRACKET) {
    const target = byExternalId.get(entry.externalId);
    if (!target) continue;
    if (!isTbdTeam(target.home_team) && !isTbdTeam(target.away_team)) {
      continue;
    }

    const homeTeam = resolveBracketTeam(entry.home, byExternalId);
    const awayTeam = resolveBracketTeam(entry.away, byExternalId);
    if (!homeTeam || !awayTeam) continue;

    if (
      target.home_team_id === homeTeam.id &&
      target.away_team_id === awayTeam.id
    ) {
      continue;
    }

    updates.push({
      matchId: target.id,
      externalId: entry.externalId,
      homeTeamId: homeTeam.id,
      awayTeamId: awayTeam.id,
    });
  }

  return updates;
}
