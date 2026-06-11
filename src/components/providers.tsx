"use client";

import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        theme="dark"
        richColors
        position="top-right"
        toastOptions={{
          style: {
            background: "#2D2D2D",
            border: "1px solid rgba(212, 175, 55, 0.2)",
            color: "#F5F5F0",
          },
        }}
      />
    </>
  );
}
