import type { MatchWithTeams } from "@/lib/queries/matches";
import { getMatchTeams } from "@/lib/match-display";
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
  const date = new Date(match.scheduled_at);
  const timeStr = date.toLocaleString("es", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  const hasScore =
    match.status === "finished" &&
    match.home_score !== null &&
    match.away_score !== null;

  return (
    <div className="flex items-center gap-4 rounded-xl border border-dorado-copa/15 bg-gris-estadio/60 px-4 py-3">
      <span className="text-lg" title={match.status}>
        {STATUS_ICON[match.status] ?? "🟡"}
      </span>

      <div className="min-w-0 flex-1">
        {isKnockoutPlaceholder ? (
          <p className="font-display text-base text-blanco-linea">
            {away ? `${home} vs ${away}` : home}
          </p>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <TeamFlag code={match.home_team.code} size="sm" />
              <span className="font-display text-base text-blanco-linea">
                {home}
              </span>
            </div>
            <span className="font-mono text-dorado-copa">
              {hasScore
                ? `${match.home_score} - ${match.away_score}`
                : "vs"}
            </span>
            <div className="flex items-center gap-2">
              <span className="font-display text-base text-blanco-linea">
                {away}
              </span>
              <TeamFlag code={match.away_team.code} size="sm" />
            </div>
          </div>
        )}
        <p className="mt-1 text-xs text-blanco-linea/50">
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
