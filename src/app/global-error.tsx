"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-negro-noche font-sans text-blanco-linea antialiased">
        <main className="flex min-h-screen flex-col items-center justify-center px-6">
          <h1 className="font-display text-3xl text-dorado-copa">
            ERROR CRÍTICO
          </h1>
          <p className="mt-3 text-sm text-blanco-linea/70">
            {error.message || "Ocurrió un error inesperado."}
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-8 rounded-lg bg-dorado-copa px-6 py-2 font-medium text-negro-noche"
          >
            Reintentar
          </button>
        </main>
      </body>
    </html>
  );
}
