interface RankingEntry {
  id: string;
  username: string;
  avatar_url: string | null;
  total_points: number;
}

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

      {entries.length === 0 ? (
        <p className="mt-6 text-sm text-blanco-linea/50">Sin datos aún.</p>
      ) : (
        <ol className="mt-4 space-y-2">
          {entries.map((entry, i) => (
            <li
              key={entry.id}
              className={`flex items-center gap-3 rounded-lg px-2 py-1.5 ${
                entry.id === currentUserId
                  ? "bg-dorado-copa/15 ring-1 ring-dorado-copa/30"
                  : ""
              }`}
            >
              <span className="w-5 font-mono text-xs text-blanco-linea/40">
                {i + 1}
              </span>
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-verde-cancha/30 text-xs font-bold text-dorado-copa">
                {entry.username[0]?.toUpperCase()}
              </div>
              <span className="min-w-0 flex-1 truncate text-sm text-blanco-linea">
                @{entry.username}
              </span>
              <span className="font-mono text-sm font-semibold text-dorado-copa">
                {entry.total_points}
              </span>
            </li>
          ))}
        </ol>
      )}
    </aside>
  );
}
