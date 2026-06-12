import { Calendar } from "lucide-react";
import { AppHeader } from "@/components/layout/app-header";
import { MatchesClient } from "@/components/matches/matches-client";
import { EmptyState } from "@/components/ui/empty-state";
import { getAllMatches } from "@/lib/queries/matches";

export default async function MatchesPage() {
  const matches = await getAllMatches();

  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="font-display text-3xl text-dorado-copa sm:text-4xl">
          PARTIDOS
        </h1>
        <p className="mt-2 text-blanco-linea/70">
          Calendario completo del Mundial 2026 — 104 partidos
        </p>

        {matches.length === 0 ? (
          <EmptyState
            className="mt-12"
            icon={Calendar}
            title="Sin partidos cargados"
            description="Ejecuta supabase/seed.sql en el SQL Editor de Supabase."
          />
        ) : (
          <div className="mt-8">
            <MatchesClient matches={matches} />
          </div>
        )}
      </main>
    </>
  );
}
