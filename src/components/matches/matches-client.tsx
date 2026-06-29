"use client";

import { useState } from "react";
import type { MatchPhase } from "@/types/database";
import type { MatchWithTeams } from "@/lib/queries/matches";
import { PhaseTabs } from "@/components/matches/phase-tabs";
import { MatchRow } from "@/components/matches/match-row";
import { getActiveTournamentPhase } from "@/lib/tournament-phase";

interface MatchesClientProps {
  matches: MatchWithTeams[];
  defaultPhase?: MatchPhase;
}

export function MatchesClient({ matches, defaultPhase }: MatchesClientProps) {
  const [phase, setPhase] = useState<MatchPhase>(
    defaultPhase ?? getActiveTournamentPhase()
  );

  const filtered = matches.filter((m) => m.phase === phase);

  return (
    <div className="space-y-6">
      <PhaseTabs active={phase} onChange={setPhase} />
      <p className="font-mono text-sm text-blanco-linea/50">
        {filtered.length} partido{filtered.length !== 1 ? "s" : ""}
      </p>
      <div className="space-y-3">
        {filtered.map((match) => (
          <MatchRow key={match.id} match={match} />
        ))}
      </div>
    </div>
  );
}
