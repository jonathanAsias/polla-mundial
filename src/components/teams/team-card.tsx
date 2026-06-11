import Link from "next/link";
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
      <div className="text-center">
        <span className="text-5xl">{team.flag_emoji}</span>
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
