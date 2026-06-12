"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-md text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-rojo-tarjeta" />
        <h1 className="mt-4 font-display text-3xl text-dorado-copa">
          ALGO SALIÓ MAL
        </h1>
        <p className="mt-3 text-sm text-blanco-linea/70">
          No pudimos cargar esta página. Intenta de nuevo.
        </p>
        <Button className="mt-8" onClick={reset}>
          Reintentar
        </Button>
      </div>
    </main>
  );
}
