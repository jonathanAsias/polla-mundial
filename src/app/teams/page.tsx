import { Users } from "lucide-react";
import { AppHeader } from "@/components/layout/app-header";
import { TeamCard } from "@/components/teams/team-card";
import { EmptyState } from "@/components/ui/empty-state";
import { getAllTeams } from "@/lib/queries/teams";

export default async function TeamsPage() {
  const teams = await getAllTeams();

  const byGroup = teams.reduce<Record<string, typeof teams>>((acc, team) => {
    const group = team.group_name ?? "Sin grupo";
    if (!acc[group]) acc[group] = [];
    acc[group].push(team);
    return acc;
  }, {});

  const groups = Object.keys(byGroup).sort();

  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="font-display text-3xl text-dorado-copa sm:text-4xl">
          EQUIPOS
        </h1>
        <p className="mt-2 text-blanco-linea/70">
          48 selecciones del Mundial 2026 — sorteo oficial FIFA
        </p>

        {teams.length === 0 ? (
          <EmptyState
            className="mt-12"
            icon={Users}
            title="Sin equipos cargados"
            description="Ejecuta el seed en Supabase para cargar las 48 selecciones."
          />
        ) : (
          <div className="mt-10 space-y-12">
            {groups.map((group) => (
              <section key={group}>
                <h2 className="mb-4 font-display text-2xl text-verde-cancha">
                  {group.toUpperCase()}
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                  {byGroup[group].map((team) => (
                    <TeamCard key={team.id} team={team} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
