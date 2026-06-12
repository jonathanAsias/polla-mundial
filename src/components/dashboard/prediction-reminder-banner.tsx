"use client";

import { AlertTriangle, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { MatchReminder } from "@/lib/queries/dashboard";

interface PredictionReminderBannerProps {
  pending: MatchReminder[];
}

export function PredictionReminderBanner({
  pending,
}: PredictionReminderBannerProps) {
  if (pending.length === 0) return null;

  return (
    <div className="mb-6 rounded-xl border border-dorado-copa/40 bg-dorado-copa/10 p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-dorado-copa" />
        <div className="min-w-0 flex-1">
          <p className="font-display text-lg text-dorado-copa">
            PREDICCIONES PENDIENTES HOY
          </p>
          <p className="mt-1 text-sm text-blanco-linea/80">
            Tienes {pending.length} partido{pending.length > 1 ? "s" : ""} sin
            predicción. Recuerda enviarla al menos{" "}
            <span className="font-mono text-dorado-copa">10 minutos</span> antes
            del inicio.
          </p>
          <ul className="mt-3 space-y-2">
            {pending.map((match) => (
              <li
                key={match.matchId}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-negro-noche/50 px-3 py-2 text-sm"
              >
                <span className="text-blanco-linea">
                  {match.homeTeam} vs {match.awayTeam}
                </span>
                <span className="font-mono text-xs text-blanco-linea/50">
                  Cierra{" "}
                  {new Date(match.deadlineAt).toLocaleTimeString("es", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

interface NotificationOptInProps {
  onEnable: () => void;
  loading: boolean;
  enabled: boolean;
}

export function NotificationOptIn({
  onEnable,
  loading,
  enabled,
}: NotificationOptInProps) {
  if (enabled || typeof window === "undefined") return null;
  if (!("Notification" in window) || Notification.permission === "denied") {
    return null;
  }

  return (
    <div className="mb-6 flex flex-col gap-3 rounded-xl border border-verde-cancha/30 bg-verde-cancha/10 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <Bell className="mt-0.5 h-5 w-5 shrink-0 text-verde-cancha" />
        <div>
          <p className="font-medium text-blanco-linea">
            Activa recordatorios push
          </p>
          <p className="text-sm text-blanco-linea/70">
            Te avisamos si falta tu predicción antes del cierre de la jornada.
          </p>
        </div>
      </div>
      <Button
        type="button"
        variant="outline"
        className="shrink-0 border-verde-cancha/40 text-verde-cancha hover:bg-verde-cancha/10"
        onClick={onEnable}
        disabled={loading}
      >
        {loading ? "Activando..." : "Activar alertas"}
      </Button>
    </div>
  );
}
