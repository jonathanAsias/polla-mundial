import { ClipboardList } from "lucide-react";
import { formatMatchDate } from "@/lib/match-datetime";
import { formatMatchResult, isDecidedByPenalties } from "@/lib/match-display";
import type { PredictionWithMatch } from "@/lib/queries/profile";
import { TeamFlag } from "@/components/teams/team-flag";
import { EmptyState } from "@/components/ui/empty-state";

interface PredictionsTableProps {
  predictions: PredictionWithMatch[];
  /** Etiqueta de la columna de predicción (p. ej. al ver otro usuario). */
  predictionColumnLabel?: string;
}

export function PredictionsTable({
  predictions,
  predictionColumnLabel = "Tu predicción",
}: PredictionsTableProps) {
  if (predictions.length === 0) {
    return (
      <EmptyState
        icon={ClipboardList}
        title="Sin predicciones"
        description="Ve al dashboard y predice los próximos partidos."
      />
    );
  }

  return (
    <>
      <div className="space-y-3 md:hidden">
        {predictions.map((p) => {
          const m = p.match;
          const resultLabel = m ? formatMatchResult(m) : null;

          return (
            <div
              key={p.id}
              className="rounded-xl border border-dorado-copa/15 bg-gris-estadio/40 p-4"
            >
              {m && (
                <>
                  <p className="text-xs text-blanco-linea/40">
                    {formatMatchDate(m.scheduled_at)}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
                    <TeamFlag code={m.home_team.code} size="sm" />
                    <span>{m.home_team.name}</span>
                    <span className="text-blanco-linea/40">vs</span>
                    <span>{m.away_team.name}</span>
                    <TeamFlag code={m.away_team.code} size="sm" />
                  </div>
                </>
              )}
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <p className="text-blanco-linea/50">Predicción</p>
                  <p className="mt-1 font-mono text-blanco-linea">
                    {p.predicted_home} - {p.predicted_away}
                  </p>
                </div>
                <div>
                  <p className="text-blanco-linea/50">Resultado</p>
                  <p className="mt-1 font-mono text-blanco-linea">
                    {resultLabel ?? "—"}
                  </p>
                  {m && resultLabel && isDecidedByPenalties(m) && (
                    <p className="mt-0.5 text-[10px] uppercase tracking-wide text-dorado-copa/80">
                      Penales
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-blanco-linea/50">Pts</p>
                  <p
                    className={`mt-1 font-mono font-semibold ${
                      resultLabel && p.points_earned > 0
                        ? "text-dorado-copa"
                        : "text-blanco-linea/40"
                    }`}
                  >
                    {resultLabel ? p.points_earned : "—"}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="hidden overflow-x-auto rounded-xl border border-dorado-copa/20 md:block">
        <table className="w-full min-w-[520px] text-sm">
          <thead>
            <tr className="border-b border-dorado-copa/15 bg-gris-estadio/80 text-left text-xs uppercase tracking-wide text-blanco-linea/50">
              <th className="px-4 py-3">Partido</th>
              <th className="px-4 py-3 text-center">{predictionColumnLabel}</th>
              <th className="px-4 py-3 text-center">Resultado</th>
              <th className="px-4 py-3 text-right">Pts</th>
            </tr>
          </thead>
          <tbody>
            {predictions.map((p) => {
              const m = p.match;
              const resultLabel = m ? formatMatchResult(m) : null;

              return (
                <tr
                  key={p.id}
                  className="border-b border-dorado-copa/10 hover:bg-gris-estadio/30"
                >
                  <td className="px-4 py-3">
                    {m ? (
                      <div className="flex flex-wrap items-center gap-2">
                        <TeamFlag code={m.home_team.code} size="sm" />
                        <span className="text-blanco-linea">{m.home_team.name}</span>
                        <span className="text-blanco-linea/40">vs</span>
                        <span className="text-blanco-linea">{m.away_team.name}</span>
                        <TeamFlag code={m.away_team.code} size="sm" />
                      </div>
                    ) : (
                      "—"
                    )}
                    {m && (
                      <p className="mt-1 text-xs text-blanco-linea/40">
                        {formatMatchDate(m.scheduled_at)}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center font-mono text-blanco-linea">
                    {p.predicted_home} - {p.predicted_away}
                  </td>
                  <td className="px-4 py-3 text-center font-mono">
                    {resultLabel ? (
                      <div className="space-y-1">
                        <span className="text-blanco-linea">{resultLabel}</span>
                        {m && isDecidedByPenalties(m) && (
                          <p className="text-[10px] uppercase tracking-wide text-dorado-copa/80">
                            Definido por penales
                          </p>
                        )}
                      </div>
                    ) : (
                      <span className="text-blanco-linea/40">Pendiente</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-semibold">
                    {resultLabel ? (
                      <span
                        className={
                          p.points_earned > 0
                            ? "text-dorado-copa"
                            : "text-blanco-linea/40"
                        }
                      >
                        {p.points_earned}
                      </span>
                    ) : (
                      <span className="text-blanco-linea/30">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
