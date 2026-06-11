"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ScoreboardDigitProps {
  value: number | string;
  className?: string;
}

export function ScoreboardDigit({ value, className }: ScoreboardDigitProps) {
  const [display, setDisplay] = useState(value);
  const [flipping, setFlipping] = useState(false);

  useEffect(() => {
    if (value !== display) {
      setFlipping(true);
      const t = setTimeout(() => {
        setDisplay(value);
        setFlipping(false);
      }, 150);
      return () => clearTimeout(t);
    }
  }, [value, display]);

  return (
    <span
      className={cn(
        "inline-block min-w-[1.2ch] text-center font-display text-5xl leading-none text-dorado-copa transition-transform duration-300",
        flipping && "scoreboard-flip",
        className
      )}
    >
      {display}
    </span>
  );
}
