"use client";

import { X } from "lucide-react";
import { PredictionsTable } from "@/components/profile/predictions-table";
import { UserAvatar } from "@/components/ranking/user-avatar";
import { Button } from "@/components/ui/button";
import type { RankingEntry } from "@/lib/queries/ranking";
import type { PredictionWithMatch } from "@/lib/queries/profile";

interface UserPredictionsPanelProps {
  user: RankingEntry;
  predictions: PredictionWithMatch[];
  loading: boolean;
  onClose: () => void;
}

export function UserPredictionsPanel({
  user,
  predictions,
  loading,
  onClose,
}: UserPredictionsPanelProps) {
  return (
    <section className="rounded-xl border border-dorado-copa/25 bg-gris-estadio/50 p-5 sm:p-6">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <UserAvatar
            username={user.username}
            avatarUrl={user.avatar_url}
            size="md"
          />
          <div>
            <h2 className="font-display text-xl text-dorado-copa">
              PREDICCIONES DE @{user.username}
            </h2>
            <p className="text-sm text-blanco-linea/60">
              {user.total_points} pts · {user.predictions_count} predicciones
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onClose}
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
  );
}
