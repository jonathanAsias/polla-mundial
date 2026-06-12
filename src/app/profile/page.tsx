import { redirect } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";
import { PointsChart } from "@/components/profile/points-chart";
import { PredictionsTable } from "@/components/profile/predictions-table";
import { ProfileForm } from "@/components/profile/profile-form";
import {
  buildPointsChart,
  getProfile,
  getUserPredictionsHistory,
} from "@/lib/queries/profile";
import { createClient } from "@/lib/supabase/server";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect=/profile");
  }

  const [profile, predictions] = await Promise.all([
    getProfile(user.id),
    getUserPredictionsHistory(user.id),
  ]);

  const chartData = buildPointsChart(predictions);
  const earnedTotal = predictions
    .filter((p) => p.match?.status === "finished")
    .reduce((sum, p) => sum + p.points_earned, 0);

  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="font-display text-3xl text-dorado-copa sm:text-4xl">
          MI PERFIL
        </h1>

        <div className="mt-8 grid gap-8 lg:grid-cols-[320px_1fr]">
          <section className="rounded-xl border border-dorado-copa/20 bg-gris-estadio/60 p-6">
            <h2 className="mb-4 font-display text-xl text-blanco-linea">
              DATOS PERSONALES
            </h2>
            <ProfileForm profile={profile} />
          </section>

          <div className="space-y-8">
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                { label: "Puntos totales", value: profile.total_points },
                { label: "Predicciones", value: predictions.length },
                { label: "Pts en finalizados", value: earnedTotal },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-dorado-copa/20 bg-gris-estadio/60 p-4 text-center"
                >
                  <p className="font-mono text-2xl font-bold text-dorado-copa">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs text-blanco-linea/50">
                    {stat.label}
                  </p>
                </div>
              ))}
            </section>

            <section className="rounded-xl border border-dorado-copa/20 bg-gris-estadio/60 p-6">
              <h2 className="mb-4 font-display text-xl text-blanco-linea">
                PROGRESO DE PUNTOS
              </h2>
              <PointsChart data={chartData} />
            </section>

            <section>
              <h2 className="mb-4 font-display text-xl text-blanco-linea">
                MIS PREDICCIONES ({predictions.length})
              </h2>
              <PredictionsTable predictions={predictions} />
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
