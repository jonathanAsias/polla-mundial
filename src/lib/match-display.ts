import { KNOCKOUT_LABELS } from "@/data/matches";

export interface MatchTeamInfo {
  code: string;
  name: string;
  flag_emoji: string | null;
}

export interface MatchDisplayInput {
  external_id: number | null;
  home_team: MatchTeamInfo;
  away_team: MatchTeamInfo;
}

export function getMatchDisplayName(match: MatchDisplayInput): {
  home: string;
  away: string;
} {
  const isKnockout =
    match.home_team.code === "TBD" || match.away_team.code === "TBD";
  const label = match.external_id ? KNOCKOUT_LABELS[match.external_id] : null;

  if (isKnockout && label) {
    if (!label.includes(" vs ")) {
      return { home: label, away: "" };
    }
    const parts = label.split(" vs ");
    return {
      home: parts[0] ?? label,
      away: parts[1] ?? "Por definir",
    };
  }

  return {
    home: match.home_team.name,
    away: match.away_team.name,
  };
}
