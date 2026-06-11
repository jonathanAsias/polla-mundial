"use client";

import { useEffect, useState } from "react";

interface CountdownTimerProps {
  deadline: Date;
}

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export function CountdownTimer({ deadline }: CountdownTimerProps) {
  const [remaining, setRemaining] = useState(
    () => deadline.getTime() - Date.now()
  );

  useEffect(() => {
    const tick = () => setRemaining(deadline.getTime() - Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [deadline]);

  if (remaining <= 0) {
    return (
      <p className="font-mono text-sm font-semibold text-rojo-tarjeta">
        Predicciones cerradas
      </p>
    );
  }

  const totalSec = Math.floor(remaining / 1000);
  const hours = Math.floor(totalSec / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  const urgent = remaining < 30 * 60 * 1000;

  return (
    <p
      className={`font-mono text-sm tabular-nums ${
        urgent ? "font-semibold text-rojo-tarjeta" : "text-blanco-linea/70"
      }`}
    >
      Cierra en {pad(hours)}:{pad(minutes)}:{pad(seconds)}
    </p>
  );
}
