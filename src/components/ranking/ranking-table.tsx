import { Trophy } from "lucide-react";
import type { RankingEntry } from "@/lib/queries/ranking";
import { UserAvatar } from "@/components/ranking/user-avatar";
import { EmptyState } from "@/components/ui/empty-state";

interface RankingTableProps {
  entries: RankingEntry[];
  currentUserId?: string;
  compact?: boolean;
}

export function RankingTable({
  entries,
  currentUserId,
  compact = false,
}: RankingTableProps) {
  if (entries.length === 0) {
    return (
      <EmptyState
        icon={Trophy}
        title="Ranking vacío"
        description="Registra predicciones para aparecer en el ranking."
      />
    );
  }

  if (compact) {
    return (
      <ol className="space-y-2">
        {entries.map((entry) => (
          <li
            key={entry.id}
            className={`flex items-center gap-3 rounded-lg px-2 py-1.5 ${
              entry.id === currentUserId
                ? "bg-dorado-copa/15 ring-1 ring-dorado-copa/30"
                : ""
            }`}
          >
            <span className="w-5 font-mono text-xs text-blanco-linea/40">
              {entry.rank}
            </span>
            <UserAvatar username={entry.username} avatarUrl={entry.avatar_url} size="sm" />
            <span className="min-w-0 flex-1 truncate text-sm text-blanco-linea">
              @{entry.username}
            </span>
            <span className="font-mono text-sm font-semibold text-dorado-copa">
              {entry.total_points}
            </span>
          </li>
        ))}
      </ol>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-dorado-copa/20">
      <table className="w-full min-w-[400px] text-sm">
        <thead>
          <tr className="border-b border-dorado-copa/15 bg-gris-estadio/80 text-left text-xs uppercase tracking-wide text-blanco-linea/50">
            <th className="px-4 py-3 font-mono">Pos</th>
            <th className="px-4 py-3">Usuario</th>
            <th className="px-4 py-3 text-right font-mono">Pts</th>
            <th className="px-4 py-3 text-right font-mono">Predicciones</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr
              key={entry.id}
              className={`border-b border-dorado-copa/10 transition ${
                entry.id === currentUserId
                  ? "bg-dorado-copa/15"
                  : "hover:bg-gris-estadio/40"
              }`}
            >
              <td className="px-4 py-3 font-mono text-blanco-linea/60">
                {entry.rank}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <UserAvatar
                    username={entry.username}
                    avatarUrl={entry.avatar_url}
                    size="sm"
                  />
                  <span className="font-medium text-blanco-linea">
                    @{entry.username}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3 text-right font-mono font-semibold text-dorado-copa">
                {entry.total_points}
              </td>
              <td className="px-4 py-3 text-right font-mono text-blanco-linea/70">
                {entry.predictions_count}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
