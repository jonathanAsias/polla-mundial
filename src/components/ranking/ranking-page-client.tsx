"use client";

import { RankingTable } from "@/components/ranking/ranking-table";
import { UserPredictionsPanel } from "@/components/ranking/user-predictions-panel";
import { useRankingUserPredictions } from "@/hooks/use-ranking-user-predictions";
import type { RankingEntry } from "@/lib/queries/ranking";

interface RankingPageClientProps {
  entries: RankingEntry[];
  currentUserId?: string;
}

export function RankingPageClient({
  entries,
  currentUserId,
}: RankingPageClientProps) {
  const { selected, predictions, loading, loadPredictions, clearSelection } =
    useRankingUserPredictions(currentUserId);

  return (
    <div className="space-y-8">
      <RankingTable
        entries={entries}
        currentUserId={currentUserId}
        onSelectUser={loadPredictions}
        selectedUserId={selected?.id}
      />

      {selected && selected.id !== currentUserId && (
        <UserPredictionsPanel
          user={selected}
          predictions={predictions}
          loading={loading}
          onClose={clearSelection}
        />
      )}

      {entries.length > 0 && !selected && (
        <p className="text-center text-xs text-blanco-linea/40">
          Toca un usuario del ranking para ver sus predicciones y resultados.
        </p>
      )}
    </div>
  );
}
