"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface SyncMenuButtonProps {
  variant?: "desktop" | "mobile";
  onDone?: () => void;
}

export function SyncMenuButton({
  variant = "desktop",
  onDone,
}: SyncMenuButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSync() {
    if (loading) return;

    setLoading(true);
    try {
      const res = await fetch("/api/sync", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "No se pudo sincronizar");
        return;
      }

      const synced = data.sync?.synced ?? 0;
      const schedulesUpdated = data.sync?.schedulesUpdated ?? 0;
      const predictionsUpdated = data.sync?.pointsCalculated ?? 0;
      const fixturesFound = data.sync?.fixturesFound ?? 0;
      const unmatched = data.sync?.unmatched ?? 0;

      if (data.sync?.error) {
        toast.error(`API-Football: ${data.sync.error}`);
        return;
      }

      if (fixturesFound === 0 && synced === 0) {
        toast.warning(
          "No se encontraron partidos del Mundial en API-Football para las fechas pendientes"
        );
        return;
      }

      if (unmatched > 0 && synced === 0) {
        toast.warning(
          `API devolvió ${fixturesFound} partido(s) pero ninguno coincidió con el calendario local`
        );
        return;
      }

      toast.success(
        synced > 0 || schedulesUpdated > 0 || predictionsUpdated > 0
          ? `Sincronizado: ${schedulesUpdated} horario${schedulesUpdated === 1 ? "" : "s"}, ${synced} resultado${synced === 1 ? "" : "s"}, ${predictionsUpdated} predicción${predictionsUpdated === 1 ? "" : "es"} recalculada${predictionsUpdated === 1 ? "" : "s"}`
          : "Todo al día — no había cambios pendientes"
      );

      router.refresh();
      onDone?.();
    } catch {
      toast.error("Error de conexión al sincronizar");
    } finally {
      setLoading(false);
    }
  }

  if (variant === "mobile") {
    return (
      <button
        type="button"
        onClick={handleSync}
        disabled={loading}
        className="flex w-full items-center rounded-lg px-4 py-3.5 text-base font-medium text-blanco-linea transition-colors hover:bg-gris-estadio active:bg-gris-estadio disabled:opacity-50"
      >
        <RefreshCw
          className={cn("mr-3 h-5 w-5 shrink-0", loading && "animate-spin")}
        />
        {loading ? "Sincronizando..." : "Sincronizar"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleSync}
      disabled={loading}
      className={cn(
        buttonVariants({ variant: "ghost", size: "sm" }),
        "text-blanco-linea/80 hover:text-dorado-copa disabled:opacity-50"
      )}
      aria-label="Sincronizar resultados y puntos"
    >
      <RefreshCw className={cn("mr-1.5 h-4 w-4", loading && "animate-spin")} />
      {loading ? "..." : "Sincronizar"}
    </button>
  );
}
