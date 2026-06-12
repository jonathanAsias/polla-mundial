import Link from "next/link";
import {
  Bell,
  Clock,
  Medal,
  Target,
  Trophy,
  Users,
} from "lucide-react";
import { AppHeader } from "@/components/layout/app-header";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const POINTS_ROWS = [
  { rule: "Aciertas el ganador del partido (o el empate)", points: "+1" },
  { rule: "Aciertas el marcador exacto", points: "+1 adicional" },
  { rule: "No aciertas ganador ni marcador", points: "0" },
  { rule: "Máximo por partido", points: "2 pts" },
];

const STEPS = [
  {
    icon: Users,
    title: "Regístrate",
    text: "Crea tu cuenta con email y elige un nombre de usuario único. Confirma tu correo para activar la cuenta.",
  },
  {
    icon: Target,
    title: "Predice la jornada",
    text: "En el Dashboard verás los partidos del día. Ingresa el marcador que crees que ocurrirá antes de que cierre el plazo.",
  },
  {
    icon: Clock,
    title: "Respeta el cierre",
    text: "Las predicciones se bloquean 10 minutos antes del pitido inicial. Pasado ese tiempo no podrás crear ni editar.",
  },
  {
    icon: Medal,
    title: "Gana puntos y sube en el ranking",
    text: "Al finalizar cada partido se calculan tus puntos automáticamente. Compite en el ranking global con otros mundialistas.",
  },
];

export default function ReglasPage() {
  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <div className="mb-10 text-center">
          <Trophy className="mx-auto h-12 w-12 text-dorado-copa" />
          <h1 className="mt-4 font-display text-3xl text-dorado-copa sm:text-4xl">
            CÓMO JUGAR
          </h1>
          <p className="mt-2 text-blanco-linea/70">
            Instrucciones y reglas de la Polla Mundialista 2026
          </p>
        </div>

        <section className="mb-10 rounded-xl border border-dorado-copa/20 bg-gris-estadio/60 p-6">
          <h2 className="font-display text-2xl text-verde-cancha">
            ¿QUÉ ES LA POLLA?
          </h2>
          <p className="mt-3 leading-relaxed text-blanco-linea/80">
            Es una competencia de predicciones del Mundial de Fútbol 2026. Antes
            de cada partido registras el marcador que crees que ocurrirá. Por
            cada acierto sumas puntos y tu posición se refleja en el ranking
            global.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 font-display text-2xl text-blanco-linea">
            PASOS PARA JUGAR
          </h2>
          <ol className="space-y-4">
            {STEPS.map((step, index) => (
              <li
                key={step.title}
                className="flex gap-4 rounded-xl border border-dorado-copa/15 bg-gris-estadio/40 p-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-dorado-copa/20">
                  <step.icon className="h-5 w-5 text-dorado-copa" />
                </div>
                <div>
                  <p className="font-display text-lg text-dorado-copa">
                    {index + 1}. {step.title}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-blanco-linea/75">
                    {step.text}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mb-10 rounded-xl border border-dorado-copa/20 bg-gris-estadio/60 p-6">
          <h2 className="font-display text-2xl text-blanco-linea">
            SISTEMA DE PUNTOS
          </h2>
          <p className="mt-2 text-sm text-blanco-linea/60">
            Los puntos se calculan automáticamente cuando el partido finaliza.
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
            Ejemplo: si predices{" "}
            <span className="font-mono text-blanco-linea">2-1</span> y el
            resultado es{" "}
            <span className="font-mono text-blanco-linea">2-1</span>, obtienes{" "}
            <span className="font-mono text-dorado-copa">2 puntos</span> (ganador
            + marcador exacto). Si predices{" "}
            <span className="font-mono text-blanco-linea">1-0</span> y el
            resultado es{" "}
            <span className="font-mono text-blanco-linea">3-0</span>, obtienes{" "}
            <span className="font-mono text-dorado-copa">1 punto</span> (solo
            ganador).
          </p>
        </section>

        <section className="mb-10 rounded-xl border border-dorado-copa/20 bg-gris-estadio/60 p-6">
          <h2 className="font-display text-2xl text-blanco-linea">
            REGLAS IMPORTANTES
          </h2>
          <ul className="mt-4 space-y-3 text-sm leading-relaxed text-blanco-linea/80">
            <li className="flex gap-2">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-dorado-copa" />
              <span>
                <strong className="text-blanco-linea">Cierre de predicciones:</strong>{" "}
                10 minutos antes del inicio del partido. El dashboard muestra un
                contador regresivo.
              </span>
            </li>
            <li className="flex gap-2">
              <Target className="mt-0.5 h-4 w-4 shrink-0 text-dorado-copa" />
              <span>
                <strong className="text-blanco-linea">Una predicción por partido:</strong>{" "}
                puedes editarla cuantas veces quieras hasta que cierre el plazo.
              </span>
            </li>
            <li className="flex gap-2">
              <Bell className="mt-0.5 h-4 w-4 shrink-0 text-dorado-copa" />
              <span>
                <strong className="text-blanco-linea">Recordatorios:</strong>{" "}
                activa las alertas en el dashboard para que te avisemos si falta
                tu predicción en la jornada de hoy.
              </span>
            </li>
            <li className="flex gap-2">
              <Medal className="mt-0.5 h-4 w-4 shrink-0 text-dorado-copa" />
              <span>
                <strong className="text-blanco-linea">Ranking:</strong> se
                ordena por puntos totales. En caso de empate, quien tenga más
                predicciones registradas aparece primero.
              </span>
            </li>
          </ul>
        </section>

        <section className="rounded-xl border border-verde-cancha/30 bg-verde-cancha/10 p-6 text-center">
          <p className="font-display text-xl text-blanco-linea">
            ¿LISTO PARA COMPETIR?
          </p>
          <p className="mt-2 text-sm text-blanco-linea/70">
            Revisa la jornada de hoy y envía tus predicciones a tiempo.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/auth/register" className={cn(buttonVariants({ size: "lg" }))}>
              Crear cuenta
            </Link>
            <Link
              href="/dashboard"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "border-dorado-copa/40 text-dorado-copa"
              )}
            >
              Ir al dashboard
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
