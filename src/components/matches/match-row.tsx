import { formatMatchDateTime } from "@/lib/match-datetime";
import type { MatchWithTeams } from "@/lib/queries/matches";
import { getMatchGroupLabel, getMatchTeams, formatPhaseLabel } from "@/lib/match-display";
import { TeamFlag } from "@/components/teams/team-flag";

const STATUS_ICON: Record<string, string> = {
  upcoming: "🟡",
  live: "🔴",
  finished: "✅",
};

interface MatchRowProps {
  match: MatchWithTeams;
}

export function MatchRow({ match }: MatchRowProps) {
  const { home, away, isKnockoutPlaceholder } = getMatchTeams(match);
  const groupLabel = getMatchGroupLabel(match);
  const timeStr = formatMatchDateTime(match.scheduled_at);

  const hasScore =
    match.status === "finished" &&
    match.home_score !== null &&
    match.away_score !== null;

  return (
    <div className="flex items-start gap-3 rounded-xl border border-dorado-copa/15 bg-gris-estadio/60 px-3 py-3 sm:items-center sm:gap-4 sm:px-4">
      <span className="shrink-0 text-base sm:text-lg" title={match.status}>
        {STATUS_ICON[match.status] ?? "🟡"}
      </span>

      <div className="min-w-0 flex-1">
        {isKnockoutPlaceholder ? (
          <p className="font-display text-base text-blanco-linea">
            {away ? `${home} vs ${away}` : home}
          </p>
        ) : (
          <div className="flex flex-col gap-1.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
            <div className="flex items-center gap-2">
              <TeamFlag code={match.home_team.code} size="sm" />
              <span className="font-display text-sm text-blanco-linea sm:text-base">
                {home}
              </span>
            </div>
            <span className="font-mono text-sm text-dorado-copa sm:text-base">
              {hasScore
                ? `${match.home_score} - ${match.away_score}`
                : "vs"}
            </span>
            <div className="flex items-center gap-2">
              <span className="font-display text-sm text-blanco-linea sm:text-base">
                {away}
              </span>
              <TeamFlag code={match.away_team.code} size="sm" />
            </div>
          </div>
        )}
        <p className="mt-1 text-xs text-blanco-linea/50">
          {formatPhaseLabel(match.phase)}
          {groupLabel && ` · ${groupLabel}`}
          {" · "}
          {timeStr}
          {match.city && ` · ${match.city}`}
          {match.venue && ` · ${match.venue}`}
        </p>
      </div>

      {match.external_id && (
        <span className="font-mono text-xs text-blanco-linea/30">
          #{match.external_id}
        </span>
      )}
    </div>
  );
}
