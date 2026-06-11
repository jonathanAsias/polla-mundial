import Link from "next/link";
import { TeamFlag } from "@/components/teams/team-flag";
import type { Team } from "@/types/database";

interface TeamCardProps {
  team: Team;
}

export function TeamCard({ team }: TeamCardProps) {
  return (
    <Link
      href={`/teams/${team.code}`}
      className="group rounded-xl border border-dorado-copa/20 bg-gris-estadio/80 p-5 transition hover:border-dorado-copa/50 hover:bg-gris-estadio"
    >
      <div className="flex flex-col items-center text-center">
        <TeamFlag code={team.code} size="lg" />
        <h3 className="mt-3 font-display text-xl tracking-wide text-blanco-linea group-hover:text-dorado-copa">
          {team.name}
        </h3>
        <p className="mt-1 font-mono text-xs text-blanco-linea/50">{team.code}</p>
        {team.group_name && (
          <p className="mt-2 text-sm text-verde-cancha">{team.group_name}</p>
        )}
      </div>
    </Link>
  );
}
