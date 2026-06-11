import { AppHeader } from "@/components/layout/app-header";
import { RankingTable } from "@/components/ranking/ranking-table";
import { getRanking } from "@/lib/queries/ranking";
import { createClient } from "@/lib/supabase/server";

export default async function RankingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const ranking = await getRanking(100);

  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="font-display text-4xl text-dorado-copa">RANKING</h1>
        <p className="mt-2 text-blanco-linea/70">
          Top 100 mundialistas — ordenado por puntos totales
        </p>

        <div className="mt-8">
          <RankingTable entries={ranking} currentUserId={user?.id} />
        </div>
      </main>
    </>
  );
}
