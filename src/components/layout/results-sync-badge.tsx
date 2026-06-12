import { RefreshCw } from "lucide-react";
import type { ResultsSyncStatus } from "@/lib/sync-meta";

interface ResultsSyncBadgeProps {
  status: ResultsSyncStatus;
}

export function ResultsSyncBadge({ status }: ResultsSyncBadgeProps) {
  const timestamp =
    status.lastUpdatedAt ?? status.latestMatchUpdate ?? null;

  if (!timestamp) {
    return (
      <p className="flex items-center gap-2 text-xs text-blanco-linea/45">
        <RefreshCw className="h-3.5 w-3.5" />
        Resultados aún sin sincronizar
      </p>
    );
  }

  const date = new Date(timestamp);
  const formatted = date.toLocaleString("es", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-blanco-linea/50">
      <RefreshCw className="h-3.5 w-3.5 shrink-0 text-dorado-copa/70" />
      <span>
        Última actualización de resultados:{" "}
        <span className="font-mono text-blanco-linea/70">{formatted}</span>
        {status.source ? (
          <span className="text-blanco-linea/40"> · {status.source}</span>
        ) : null}
      </span>
    </p>
  );
}
