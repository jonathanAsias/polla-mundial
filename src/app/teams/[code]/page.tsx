import Link from "next/link";
import { notFound } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";
import { MatchRow } from "@/components/matches/match-row";
import { TeamFlag } from "@/components/teams/team-flag";
import { buttonVariants } from "@/components/ui/button";
import { getTeamByCode, getTeamGroupMatches } from "@/lib/queries/teams";
import { cn } from "@/lib/utils";
import type { MatchWithTeams } from "@/lib/queries/matches";

interface TeamPageProps {
  params: { code: string };
}

export default async function TeamPage({ params }: TeamPageProps) {
  const team = await getTeamByCode(params.code.toUpperCase());
  if (!team || team.code === "TBD") notFound();

  const rawMatches = await getTeamGroupMatches(team.id);
  const matches = rawMatches as unknown as MatchWithTeams[];

  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <Link
          href="/teams"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "mb-6")}
        >
          ← Volver a equipos
        </Link>

        <div className="flex flex-col items-center text-center">
          <TeamFlag code={team.code} size="xl" />
          <h1 className="mt-4 font-display text-5xl text-dorado-copa">
            {team.name.toUpperCase()}
          </h1>
          <p className="mt-2 font-mono text-sm text-blanco-linea/50">
            {team.code} · {team.group_name}
          </p>
        </div>

        <section className="mt-12">
          <h2 className="mb-4 font-display text-2xl text-blanco-linea">
            PARTIDOS DE GRUPO
          </h2>
          {matches.length === 0 ? (
            <p className="text-blanco-linea/50">Sin partidos cargados.</p>
          ) : (
            <div className="space-y-3">
              {matches.map((match) => (
                <MatchRow key={match.id} match={match} />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
