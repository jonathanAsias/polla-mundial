import { KNOCKOUT_LABELS } from "@/data/matches";
import type { MatchPhase } from "@/types/database";

const PHASE_LABELS: Record<MatchPhase, string> = {
  group: "Fase de grupos",
  r32: "32avos de final",
  r16: "Octavos de final",
  qf: "Cuartos de final",
  sf: "Semifinal",
  final: "Final",
};

export function formatPhaseLabel(phase: MatchPhase): string {
  return PHASE_LABELS[phase] ?? phase;
}

export interface MatchTeamInfo {
  code: string;
  name: string;
  flag_emoji: string | null;
  group_name?: string | null;
}

export interface MatchDisplayInput {
  phase: string;
  external_id: number | null;
  home_team: MatchTeamInfo;
  away_team: MatchTeamInfo;
}

export function getMatchTeams(match: MatchDisplayInput): {
  home: string;
  away: string;
  isKnockoutPlaceholder: boolean;
} {
  const isPlaceholder =
    match.home_team.code === "TBD" || match.away_team.code === "TBD";

  if (!isPlaceholder) {
    return {
      home: match.home_team.name,
      away: match.away_team.name,
      isKnockoutPlaceholder: false,
    };
  }

  const label = match.external_id ? KNOCKOUT_LABELS[match.external_id] : null;
  if (!label) {
    return {
      home: "Por definir",
      away: "",
      isKnockoutPlaceholder: true,
    };
  }

  if (!label.includes(" vs ")) {
    return { home: label, away: "", isKnockoutPlaceholder: true };
  }

  const parts = label.split(" vs ");
  return {
    home: parts[0] ?? label,
    away: parts[1] ?? "Por definir",
    isKnockoutPlaceholder: true,
  };
}

export function getMatchGroupLabel(match: {
  phase: string;
  home_team: MatchTeamInfo;
  away_team: MatchTeamInfo;
}): string | null {
  if (match.phase !== "group") return null;
  return match.home_team.group_name ?? match.away_team.group_name ?? null;
}

export interface MatchResultInput {
  home_score: number | null;
  away_score: number | null;
  winner_side?: "home" | "away" | null;
  home_penalties?: number | null;
  away_penalties?: number | null;
  status?: string;
}

/** Marcador para mostrar; incluye penales si aplica (p. ej. 1-1 (4-3 pen.)). */
export function formatMatchResult(match: MatchResultInput): string | null {
  if (
    match.status !== "finished" ||
    match.home_score === null ||
    match.away_score === null
  ) {
    return null;
  }

  const base = `${match.home_score} - ${match.away_score}`;

  if (
    match.home_penalties !== null &&
    match.home_penalties !== undefined &&
    match.away_penalties !== null &&
    match.away_penalties !== undefined
  ) {
    return `${base} (${match.home_penalties}-${match.away_penalties} pen.)`;
  }

  if (
    match.winner_side &&
    match.home_score === match.away_score
  ) {
    return `${base} (pen.)`;
  }

  return base;
}

/** @deprecated Usar getMatchTeams */
export function getMatchDisplayName(match: MatchDisplayInput): {
  home: string;
  away: string;
} {
  const { home, away } = getMatchTeams(match);
  return { home, away };
}
