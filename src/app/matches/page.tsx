import { AppHeader } from "@/components/layout/app-header";
import { MatchesClient } from "@/components/matches/matches-client";
import { getAllMatches } from "@/lib/queries/matches";

export default async function MatchesPage() {
  const matches = await getAllMatches();

  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="font-display text-4xl text-dorado-copa">PARTIDOS</h1>
        <p className="mt-2 text-blanco-linea/70">
          Calendario completo del Mundial 2026 — 104 partidos
        </p>

        {matches.length === 0 ? (
          <div className="mt-12 rounded-xl border border-dorado-copa/20 bg-gris-estadio p-8 text-center">
            <p className="text-blanco-linea/70">
              No hay partidos cargados. Ejecuta{" "}
              <code className="font-mono text-dorado-copa">npm run seed</code>
            </p>
          </div>
        ) : (
          <div className="mt-8">
            <MatchesClient matches={matches} />
          </div>
        )}
      </main>
    </>
  );
}
