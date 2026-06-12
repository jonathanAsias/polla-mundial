import Link from "next/link";
import { Bell, Clock, Target, Trophy } from "lucide-react";
import { AppHeader } from "@/components/layout/app-header";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const POINTS_ROWS = [
  { rule: "Aciertas el ganador del partido (o el empate)", points: "1 pt" },
  { rule: "Aciertas el marcador exacto", points: "2 pts" },
  { rule: "Aciertas ganador y marcador exacto", points: "3 pts (1 + 2)" },
  { rule: "No aciertas nada", points: "0 pts" },
];

export default function ReglasPage() {
  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <div className="mb-10 text-center">
          <Trophy className="mx-auto h-12 w-12 text-dorado-copa" />
          <h1 className="mt-4 font-display text-3xl text-dorado-copa sm:text-4xl">
            REGLAS DEL JUEGO
          </h1>
          <p className="mt-2 text-blanco-linea/70">
            Puntos, plazos y recordatorios
          </p>
        </div>

        <section className="mb-10 rounded-xl border border-dorado-copa/20 bg-gris-estadio/60 p-6">
          <h2 className="font-display text-2xl text-blanco-linea">
            SISTEMA DE PUNTOS
          </h2>
          <p className="mt-2 text-sm text-blanco-linea/60">
            Al finalizar cada jornada (medianoche, hora Ciudad de México), el
            sistema compara tus predicciones con los resultados finales de cada
            partido del día y actualiza puntos y ranking.
          </p>
          <div className="mt-4 overflow-hidden rounded-lg border border-dorado-copa/15">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dorado-copa/15 bg-negro-noche/50 text-left text-xs uppercase tracking-wide text-blanco-linea/50">
                  <th className="px-4 py-3">Situación</th>
                  <th className="px-4 py-3 text-right">Puntos</th>
                </tr>
              </thead>
              <tbody>
                {POINTS_ROWS.map((row) => (
                  <tr
                    key={row.rule}
                    className="border-b border-dorado-copa/10 last:border-0"
                  >
                    <td className="px-4 py-3 text-blanco-linea">{row.rule}</td>
                    <td className="px-4 py-3 text-right font-mono font-semibold text-dorado-copa">
                      {row.points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-blanco-linea/60">
            Ejemplo: predices{" "}
            <span className="font-mono text-blanco-linea">2-1</span> y el
            resultado es{" "}
            <span className="font-mono text-blanco-linea">2-1</span> →{" "}
            <span className="font-mono text-dorado-copa">3 puntos</span> (1 por
            ganador + 2 por marcador). Si predices{" "}
            <span className="font-mono text-blanco-linea">1-0</span> y el
            resultado es{" "}
            <span className="font-mono text-blanco-linea">3-0</span> →{" "}
            <span className="font-mono text-dorado-copa">1 punto</span> (solo
            ganador).
          </p>
        </section>

        <section className="mb-10 rounded-xl border border-dorado-copa/20 bg-gris-estadio/60 p-6">
          <h2 className="font-display text-2xl text-blanco-linea">
            PLAZO DE PREDICCIONES
          </h2>
          <ul className="mt-4 space-y-3 text-sm leading-relaxed text-blanco-linea/80">
            <li className="flex gap-2">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-dorado-copa" />
              <span>
                En el <strong className="text-blanco-linea">Dashboard</strong>{" "}
                ves los partidos de la jornada del día (horario Ciudad de México).
              </span>
            </li>
            <li className="flex gap-2">
              <Target className="mt-0.5 h-4 w-4 shrink-0 text-dorado-copa" />
              <span>
                <strong className="text-blanco-linea">Una predicción por partido:</strong>{" "}
                puedes guardarla y editarla cuantas veces quieras hasta que
                cierre el plazo.
              </span>
            </li>
            <li className="flex gap-2">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-dorado-copa" />
              <span>
                <strong className="text-blanco-linea">Cierre:</strong> 10 minutos
                antes del pitido inicial. Después no se aceptan cambios.
              </span>
            </li>
          </ul>
        </section>

        <section className="mb-10 rounded-xl border border-dorado-copa/20 bg-gris-estadio/60 p-6">
          <h2 className="font-display text-2xl text-blanco-linea">
            NOTIFICACIONES
          </h2>
          <ul className="mt-4 space-y-3 text-sm leading-relaxed text-blanco-linea/80">
            <li className="flex gap-2">
              <Bell className="mt-0.5 h-4 w-4 shrink-0 text-dorado-copa" />
              <span>
                Activa <strong className="text-blanco-linea">“Activar alertas”</strong>{" "}
                en el dashboard para recibir avisos si te falta predicción en
                partidos de hoy.
              </span>
            </li>
            <li className="flex gap-2">
              <Bell className="mt-0.5 h-4 w-4 shrink-0 text-dorado-copa" />
              <span>
                También verás un banner en el dashboard cuando tengas partidos
                pendientes en la jornada.
              </span>
            </li>
          </ul>
        </section>

        <section className="rounded-xl border border-verde-cancha/30 bg-verde-cancha/10 p-6 text-center">
          <Link
            href="/dashboard"
            className={cn(buttonVariants({ size: "lg" }))}
          >
            Ir al dashboard
          </Link>
        </section>
      </main>
    </>
  );
}
