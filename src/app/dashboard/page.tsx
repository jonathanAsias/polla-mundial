import { CalendarDays } from "lucide-react";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";
import { MatchCard } from "@/components/match/match-card";
import { DashboardRankingArea } from "@/components/dashboard/dashboard-ranking-area";
import { EmptyState } from "@/components/ui/empty-state";
import { MatchNotificationManager } from "@/components/dashboard/match-notification-manager";
import {
  getTodayJornadaMatches,
  getTodayFifaCalendarLabel,
  getUpcomingKnockoutMatches,
  getUserPredictionsForMatches,
} from "@/lib/queries/dashboard";
import { getRanking } from "@/lib/queries/ranking";
import { ResultsSyncBadge } from "@/components/layout/results-sync-badge";
import { createClient } from "@/lib/supabase/server";
import { getResultsSyncStatus } from "@/lib/sync-meta";
import { runResultsSync } from "@/lib/run-sync";
import { getTournamentCalendarDay } from "@/lib/timezone";
import { getActiveTournamentPhase } from "@/lib/tournament-phase";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const [profileRes, ranking, syncStatus] = await Promise.all([
    supabase
      .from("profiles")
      .select("username, total_points")
      .eq("id", user.id)
      .single<{ username: string; total_points: number }>(),
    getRanking(10),
    getResultsSyncStatus(),
  ]);

  let matches = await getTodayJornadaMatches();
  if (matches.length === 0 && getTournamentCalendarDay()) {
    await runResultsSync().catch(() => {});
    matches = await getTodayJornadaMatches();
  }

  const knockoutMatches =
    getActiveTournamentPhase() !== "group"
      ? await getUpcomingKnockoutMatches()
      : [];

  const todayIds = new Set(matches.map((m) => m.id));
  const extraKnockout = knockoutMatches.filter((m) => !todayIds.has(m.id));

  const allMatchIds = [
    ...matches.map((m) => m.id),
    ...extraKnockout.map((m) => m.id),
  ];

  const profile = profileRes.data;
  const predictions = await getUserPredictionsForMatches(user.id, allMatchIds);

  const fifaDay = getTodayFifaCalendarLabel();

  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8">
          <h1 className="font-display text-3xl text-dorado-copa sm:text-4xl">
            DASHBOARD
          </h1>
          <div className="mt-3">
            <ResultsSyncBadge status={syncStatus} />
          </div>
          <p className="mt-2 text-blanco-linea/70">
            Bienvenido,{" "}
            <span className="font-mono text-dorado-copa">
              @{profile?.username ?? "usuario"}
            </span>
            <span className="ml-3 font-mono text-sm text-blanco-linea/50">
              {profile?.total_points ?? 0} pts
            </span>
          </p>
        </div>

        <MatchNotificationManager />

        <DashboardRankingArea entries={ranking} currentUserId={user.id}>
          <section>
            <h2 className="mb-4 font-display text-2xl text-blanco-linea">
              JORNADA DE HOY
            </h2>
            <p className="mb-4 text-sm text-blanco-linea/50">
              Jornada del calendario FIFA: {fifaDay}. Horarios en Ciudad de
              México. Las predicciones cierran 10 minutos antes de cada partido.
            </p>

            {matches.length === 0 ? (
              <EmptyState
                icon={CalendarDays}
                title="No hay partidos hoy"
                description="No hay encuentros programados para la jornada de hoy. Revisa el calendario en Partidos."
              />
            ) : (
              <div className="space-y-6">
                {matches.map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    prediction={predictions[match.id]}
                  />
                ))}
              </div>
            )}
          </section>

          {extraKnockout.length > 0 && (
            <section className="mt-12">
              <h2 className="mb-4 font-display text-2xl text-blanco-linea">
                ELIMINATORIA — PRÓXIMOS PARTIDOS
              </h2>
              <p className="mb-4 text-sm text-blanco-linea/50">
                32avos de final y fases siguientes. Predicciones abiertas hasta
                10 minutos antes de cada partido.
              </p>
              <div className="space-y-6">
                {extraKnockout.map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    prediction={predictions[match.id]}
                  />
                ))}
              </div>
            </section>
          )}
        </DashboardRankingArea>
      </main>
    </>
  );
}
