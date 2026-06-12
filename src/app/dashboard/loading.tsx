import { AppHeader } from "@/components/layout/app-header";
import {
  MatchCardSkeleton,
  PageHeaderSkeleton,
  RankingTableSkeleton,
} from "@/components/skeletons/list-skeletons";

export default function DashboardLoading() {
  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <PageHeaderSkeleton />
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_280px]">
          <MatchCardSkeleton count={3} />
          <aside className="rounded-xl border border-dorado-copa/20 bg-gris-estadio/80 p-5">
            <RankingTableSkeleton count={10} />
          </aside>
        </div>
      </main>
    </>
  );
}
