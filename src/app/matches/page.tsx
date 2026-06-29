import { Calendar } from "lucide-react";
import { AppHeader } from "@/components/layout/app-header";
import { MatchesClient } from "@/components/matches/matches-client";
import { EmptyState } from "@/components/ui/empty-state";
import { ResultsSyncBadge } from "@/components/layout/results-sync-badge";
import { getAllMatches } from "@/lib/queries/matches";
import { getResultsSyncStatus } from "@/lib/sync-meta";
import { getActiveTournamentPhase } from "@/lib/tournament-phase";

export default async function MatchesPage() {
  const [matches, syncStatus] = await Promise.all([
    getAllMatches(),
    getResultsSyncStatus(),
  ]);

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
        <div className="mt-3">
          <ResultsSyncBadge status={syncStatus} />
        </div>

        {matches.length === 0 ? (
          <EmptyState
            className="mt-12"
            icon={Calendar}
            title="Sin partidos cargados"
            description="Ejecuta supabase/seed.sql en el SQL Editor de Supabase."
          />
        ) : (
          <div className="mt-8">
            <MatchesClient
              matches={matches}
              defaultPhase={getActiveTournamentPhase()}
            />
          </div>
        )}
      </main>
    </>
  );
}
