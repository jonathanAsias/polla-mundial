"use client";

import { useCallback, useState } from "react";
import { X } from "lucide-react";
import { RankingTable } from "@/components/ranking/ranking-table";
import { PredictionsTable } from "@/components/profile/predictions-table";
import { UserAvatar } from "@/components/ranking/user-avatar";
import { Button } from "@/components/ui/button";
import type { RankingEntry } from "@/lib/queries/ranking";
import type { PredictionWithMatch } from "@/lib/queries/profile";

interface RankingPageClientProps {
  entries: RankingEntry[];
  currentUserId?: string;
}

export function RankingPageClient({
  entries,
  currentUserId,
}: RankingPageClientProps) {
  const [selected, setSelected] = useState<RankingEntry | null>(null);
  const [predictions, setPredictions] = useState<PredictionWithMatch[]>([]);
  const [loading, setLoading] = useState(false);

  const loadPredictions = useCallback(async (entry: RankingEntry) => {
    if (entry.id === currentUserId) {
      setSelected(null);
      setPredictions([]);
      return;
    }

    setSelected(entry);
    setLoading(true);
    try {
      const res = await fetch(`/api/ranking/${entry.id}/predictions`);
      const data = await res.json();
      if (res.ok) {
        setPredictions(data.predictions ?? []);
      } else {
        setPredictions([]);
      }
    } catch {
      setPredictions([]);
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);

  return (
    <div className="space-y-8">
      <RankingTable
        entries={entries}
        currentUserId={currentUserId}
        onSelectUser={loadPredictions}
        selectedUserId={selected?.id}
      />

      {selected && selected.id !== currentUserId && (
        <section className="rounded-xl border border-dorado-copa/25 bg-gris-estadio/50 p-5 sm:p-6">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <UserAvatar
                username={selected.username}
                avatarUrl={selected.avatar_url}
                size="md"
              />
              <div>
                <h2 className="font-display text-xl text-dorado-copa">
                  PREDICCIONES DE @{selected.username}
                </h2>
                <p className="text-sm text-blanco-linea/60">
                  {selected.total_points} pts · {selected.predictions_count}{" "}
                  predicciones
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelected(null);
                setPredictions([]);
              }}
              aria-label="Cerrar"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {loading ? (
            <p className="text-sm text-blanco-linea/50">Cargando...</p>
          ) : (
            <PredictionsTable predictions={predictions} />
          )}
        </section>
      )}

      {entries.length > 0 && !selected && (
        <p className="text-center text-xs text-blanco-linea/40">
          Toca un usuario del ranking para ver sus predicciones y resultados.
        </p>
      )}
    </div>
  );
}
