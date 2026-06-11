import { Trophy } from "lucide-react";

const FLAGS = ["🇲🇽", "🇧🇷", "🇦🇷", "🇺🇸", "🇪🇸", "🇩🇪", "🇫🇷", "🇯🇵"];

export function AuthBranding() {
  return (
    <div className="relative hidden flex-col items-center justify-center overflow-hidden bg-verde-cancha p-12 lg:flex">
      <div className="absolute inset-0 bg-grass-pattern opacity-40" />

      <div className="relative z-10 text-center">
        <div className="mb-8 flex justify-center">
          <div className="animate-pulse rounded-full border-2 border-dorado-copa/50 bg-negro-noche/30 p-6">
            <Trophy className="h-20 w-20 text-dorado-copa" strokeWidth={1.2} />
          </div>
        </div>

        <h1 className="font-display text-5xl tracking-wider text-dorado-copa">
          POLLA MUNDIALISTA
        </h1>
        <p className="mt-2 font-display text-3xl tracking-[0.3em] text-blanco-linea/90">
          2026
        </p>
        <p className="mx-auto mt-6 max-w-xs text-sm leading-relaxed text-blanco-linea/70">
          Predice, compite y demuestra quién conoce más el fútbol mundial.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {FLAGS.map((flag) => (
            <span
              key={flag}
              className="text-3xl transition-transform hover:scale-125"
            >
              {flag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
