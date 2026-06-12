import { CalendarDays } from "lucide-react";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";
import { MatchCard } from "@/components/match/match-card";
import { RankingWidget } from "@/components/ranking/ranking-widget";
import { EmptyState } from "@/components/ui/empty-state";
import {
  getDashboardMatches,
  getUserPredictionsForMatches,
} from "@/lib/queries/dashboard";
import { getRanking } from "@/lib/queries/ranking";
import { createClient } from "@/lib/supabase/server";
import { isSameCalendarDay } from "@/lib/predictions";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const [profileRes, matches, ranking] = await Promise.all([
    supabase
      .from("profiles")
      .select("username, total_points")
      .eq("id", user.id)
      .single<{ username: string; total_points: number }>(),
    getDashboardMatches(),
    getRanking(10),
  ]);

  const profile = profileRes.data;
  const predictions = await getUserPredictionsForMatches(
    user.id,
    matches.map((m) => m.id)
  );

  const hasTodayMatches = matches.some((m) =>
    isSameCalendarDay(new Date(m.scheduled_at), new Date())
  );

  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8">
          <h1 className="font-display text-3xl text-dorado-copa sm:text-4xl">
            DASHBOARD
          </h1>
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

        <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
          <section>
            <h2 className="mb-4 font-display text-2xl text-blanco-linea">
              {hasTodayMatches ? "PARTIDOS DE HOY" : "PRÓXIMOS PARTIDOS"}
            </h2>

            {matches.length === 0 ? (
              <EmptyState
                icon={CalendarDays}
                title="No hay partidos próximos"
                description="Verifica que el seed esté cargado en Supabase."
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

          <RankingWidget entries={ranking} currentUserId={user.id} />
        </div>
      </main>
    </>
  );
}
