import { KNOCKOUT_LABELS } from "@/data/matches";

export interface MatchTeamInfo {
  code: string;
  name: string;
  flag_emoji: string | null;
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

/** @deprecated Usar getMatchTeams */
export function getMatchDisplayName(match: MatchDisplayInput): {
  home: string;
  away: string;
} {
  const { home, away } = getMatchTeams(match);
  return { home, away };
}
