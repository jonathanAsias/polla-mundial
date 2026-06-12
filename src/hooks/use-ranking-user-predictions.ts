"use client";

import { useCallback, useState } from "react";
import type { RankingEntry } from "@/lib/queries/ranking";
import type { PredictionWithMatch } from "@/lib/queries/profile";

export function useRankingUserPredictions(currentUserId?: string) {
  const [selected, setSelected] = useState<RankingEntry | null>(null);
  const [predictions, setPredictions] = useState<PredictionWithMatch[]>([]);
  const [loading, setLoading] = useState(false);

  const loadPredictions = useCallback(
    async (entry: RankingEntry) => {
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
    },
    [currentUserId]
  );

  const clearSelection = useCallback(() => {
    setSelected(null);
    setPredictions([]);
  }, []);

  return {
    selected,
    predictions,
    loading,
    loadPredictions,
    clearSelection,
  };
}
