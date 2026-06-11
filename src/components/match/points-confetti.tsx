"use client";

import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";

interface PointsConfettiProps {
  points: number;
  active: boolean;
}

export function PointsConfetti({ points, active }: PointsConfettiProps) {
  const fired = useRef(false);

  useEffect(() => {
    if (!active || points <= 0 || fired.current) return;
    fired.current = true;

    const duration = 1200;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ["#D4AF37", "#1A6B2F", "#F5F5F0"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ["#D4AF37", "#1A6B2F", "#F5F5F0"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, [active, points]);

  return null;
}
