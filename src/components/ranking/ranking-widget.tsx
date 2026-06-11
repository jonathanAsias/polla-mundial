import { RankingTable } from "@/components/ranking/ranking-table";
import type { RankingEntry } from "@/lib/queries/ranking";

interface RankingWidgetProps {
  entries: RankingEntry[];
  currentUserId?: string;
}

export function RankingWidget({ entries, currentUserId }: RankingWidgetProps) {
  return (
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
        />
      </div>
    </aside>
  );
}
