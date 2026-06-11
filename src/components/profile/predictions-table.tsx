import type { PredictionWithMatch } from "@/lib/queries/profile";
import { TeamFlag } from "@/components/teams/team-flag";

interface PredictionsTableProps {
  predictions: PredictionWithMatch[];
}

export function PredictionsTable({ predictions }: PredictionsTableProps) {
  if (predictions.length === 0) {
    return (
      <p className="text-sm text-blanco-linea/50">
        No has registrado predicciones aún.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-dorado-copa/20">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-dorado-copa/15 bg-gris-estadio/80 text-left text-xs uppercase tracking-wide text-blanco-linea/50">
            <th className="px-4 py-3">Partido</th>
            <th className="px-4 py-3 text-center">Tu predicción</th>
            <th className="px-4 py-3 text-center">Resultado</th>
            <th className="px-4 py-3 text-right">Pts</th>
          </tr>
        </thead>
        <tbody>
          {predictions.map((p) => {
            const m = p.match;
            const finished =
              m?.status === "finished" &&
              m.home_score !== null &&
              m.away_score !== null;

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
                      {new Date(m.scheduled_at).toLocaleDateString("es", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3 text-center font-mono text-blanco-linea">
                  {p.predicted_home} - {p.predicted_away}
                </td>
                <td className="px-4 py-3 text-center font-mono">
                  {finished ? (
                    <span className="text-blanco-linea">
                      {m.home_score} - {m.away_score}
                    </span>
                  ) : (
                    <span className="text-blanco-linea/40">Pendiente</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right font-mono font-semibold">
                  {finished ? (
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
  );
}
