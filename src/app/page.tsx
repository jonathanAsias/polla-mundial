import Link from "next/link";
import { Trophy } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-2xl text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full border border-dorado-copa/30 bg-gris-estadio p-5">
            <Trophy className="h-16 w-16 text-dorado-copa" strokeWidth={1.5} />
          </div>
        </div>

        <h1 className="font-display text-6xl tracking-wide text-dorado-copa sm:text-7xl">
          POLLA MUNDIALISTA
        </h1>
        <p className="mt-2 font-display text-2xl tracking-widest text-verde-cancha">
          2026
        </p>

        <p className="mx-auto mt-6 max-w-md text-base text-blanco-linea/80">
          Predice los resultados del Mundial, gana puntos por cada acierto y
          compite en el ranking global con fanáticos del fútbol.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/auth/login"
            className={cn(buttonVariants({ size: "lg" }), "min-w-40")}
          >
            Iniciar sesión
          </Link>
          <Link
            href="/auth/register"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "min-w-40 border-dorado-copa/40 text-dorado-copa hover:bg-dorado-copa/10"
            )}
          >
            Registrarse
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/teams"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "border-dorado-copa/40 text-dorado-copa"
            )}
          >
            Ver equipos
          </Link>
          <Link
            href="/matches"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "border-dorado-copa/40 text-dorado-copa"
            )}
          >
            Ver partidos
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-4 text-center">
          {[
            { value: "2", label: "pts máx / partido" },
            { value: "48", label: "selecciones" },
            { value: "10m", label: "cierre predicciones" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg border border-dorado-copa/20 bg-gris-estadio/60 px-3 py-4"
            >
              <p className="font-mono text-2xl font-bold text-dorado-copa">
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-blanco-linea/60">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
