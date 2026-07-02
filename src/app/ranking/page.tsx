import { AppHeader } from "@/components/layout/app-header";
import { RankingPageClient } from "@/components/ranking/ranking-page-client";
import { getRanking } from "@/lib/queries/ranking";
import { ResultsSyncBadge } from "@/components/layout/results-sync-badge";
import { createClient } from "@/lib/supabase/server";
import { getResultsSyncStatus } from "@/lib/sync-meta";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function RankingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [ranking, syncStatus] = await Promise.all([
    getRanking(100),
    getResultsSyncStatus(),
  ]);

  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="font-display text-3xl text-dorado-copa sm:text-4xl">
          RANKING
        </h1>
        <p className="mt-2 text-blanco-linea/70">
          Top 100 mundialistas — ordenado por puntos totales
        </p>
        <div className="mt-3">
          <ResultsSyncBadge status={syncStatus} />
        </div>

        <div className="mt-8">
          <RankingPageClient entries={ranking} currentUserId={user?.id} />
        </div>
      </main>
    </>
  );
}
