"use client";

import { cn } from "@/lib/utils";
import type { MatchPhase } from "@/types/database";

const PHASES: { id: MatchPhase; label: string }[] = [
  { id: "group", label: "Grupos" },
  { id: "r32", label: "32avos" },
  { id: "r16", label: "Octavos" },
  { id: "qf", label: "Cuartos" },
  { id: "sf", label: "Semis" },
  { id: "final", label: "Final" },
];

interface PhaseTabsProps {
  active: MatchPhase;
  onChange: (phase: MatchPhase) => void;
}

export function PhaseTabs({ active, onChange }: PhaseTabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {PHASES.map((phase) => (
        <button
          key={phase.id}
          type="button"
          onClick={() => onChange(phase.id)}
          className={cn(
            "rounded-lg border px-3 py-1.5 font-display text-sm tracking-wide transition",
            active === phase.id
              ? "border-dorado-copa bg-dorado-copa/20 text-dorado-copa"
              : "border-dorado-copa/20 text-blanco-linea/60 hover:border-dorado-copa/40 hover:text-blanco-linea"
          )}
        >
          {phase.label}
        </button>
      ))}
    </div>
  );
}
