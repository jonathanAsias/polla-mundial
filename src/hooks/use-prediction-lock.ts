"use client";

import { useEffect, useState } from "react";
import { isPredictionLocked } from "@/lib/predictions";

export function usePredictionLock(scheduledAt: string, status: string) {
  const [locked, setLocked] = useState(() =>
    isPredictionLocked(scheduledAt, status)
  );

  useEffect(() => {
    const update = () => setLocked(isPredictionLocked(scheduledAt, status));
    update();

    if (status === "live" || status === "finished") return;

    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [scheduledAt, status]);

  return locked;
}
