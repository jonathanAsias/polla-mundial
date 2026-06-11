"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Prediction } from "@/types/database";

interface PredictionFormProps {
  matchId: number;
  homeTeam: string;
  awayTeam: string;
  prediction?: Prediction;
  isLocked: boolean;
  onSaved: (prediction: Prediction) => void;
}

export function PredictionForm({
  matchId,
  homeTeam,
  awayTeam,
  prediction,
  isLocked,
  onSaved,
}: PredictionFormProps) {
  const [home, setHome] = useState(
    prediction?.predicted_home?.toString() ?? ""
  );
  const [away, setAway] = useState(
    prediction?.predicted_away?.toString() ?? ""
  );
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isLocked) return;

    const predictedHome = parseInt(home, 10);
    const predictedAway = parseInt(away, 10);

    if (
      Number.isNaN(predictedHome) ||
      Number.isNaN(predictedAway) ||
      predictedHome < 0 ||
      predictedHome > 20 ||
      predictedAway < 0 ||
      predictedAway > 20
    ) {
      toast.error("Ingresa marcadores válidos (0–20)");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/predictions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matchId,
          predictedHome,
          predictedAway,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "Error al guardar");
        return;
      }

      onSaved(data.prediction);
      toast.success(
        prediction ? "Predicción actualizada" : "Predicción guardada"
      );
    } catch {
      toast.error("Error de conexión");
    } finally {
      setLoading(false);
    }
  }

  if (isLocked) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-dorado-copa/10 bg-negro-noche/50 px-3 py-2">
        <Lock className="h-4 w-4 text-dorado-copa/60" />
        <span className="text-sm text-blanco-linea/50">
          {prediction
            ? `Tu predicción: ${prediction.predicted_home} - ${prediction.predicted_away}`
            : "Predicciones cerradas"}
        </span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor={`home-${matchId}`} className="text-xs">
            {homeTeam}
          </Label>
          <Input
            id={`home-${matchId}`}
            type="number"
            min={0}
            max={20}
            value={home}
            onChange={(e) => setHome(e.target.value)}
            required
            className="font-mono text-center"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor={`away-${matchId}`} className="text-xs">
            {awayTeam}
          </Label>
          <Input
            id={`away-${matchId}`}
            type="number"
            min={0}
            max={20}
            value={away}
            onChange={(e) => setAway(e.target.value)}
            required
            className="font-mono text-center"
          />
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading
          ? "Guardando..."
          : prediction
            ? "Actualizar predicción"
            : "Guardar predicción"}
      </Button>
    </form>
  );
}
