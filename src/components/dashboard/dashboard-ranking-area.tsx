"use client";

import { RankingTable } from "@/components/ranking/ranking-table";
import { UserPredictionsPanel } from "@/components/ranking/user-predictions-panel";
import { useRankingUserPredictions } from "@/hooks/use-ranking-user-predictions";
import type { RankingEntry } from "@/lib/queries/ranking";

interface DashboardRankingAreaProps {
  entries: RankingEntry[];
  currentUserId?: string;
  children: React.ReactNode;
}

export function DashboardRankingArea({
  entries,
  currentUserId,
  children,
}: DashboardRankingAreaProps) {
  const { selected, predictions, loading, loadPredictions, clearSelection } =
    useRankingUserPredictions(currentUserId);

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
        {children}

        <aside className="rounded-xl border border-dorado-copa/20 bg-gris-estadio/80 p-5">
          <h2 className="font-display text-xl tracking-wide text-dorado-copa">
            TOP 10
          </h2>
          <p className="mt-1 text-xs text-blanco-linea/50">Ranking global</p>
          <div className="mt-4">
            <RankingTable
              entries={entries}
              currentUserId={currentUserId}
              compact
              onSelectUser={loadPredictions}
              selectedUserId={selected?.id}
            />
          </div>
          {entries.length > 0 && !selected && (
            <p className="mt-3 text-xs text-blanco-linea/40">
              Toca un usuario para ver sus predicciones.
            </p>
          )}
        </aside>
      </div>

      {selected && selected.id !== currentUserId && (
        <UserPredictionsPanel
          user={selected}
          predictions={predictions}
          loading={loading}
          onClose={clearSelection}
        />
      )}
    </div>
  );
}
