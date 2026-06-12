import { AppHeader } from "@/components/layout/app-header";
import {
  PageHeaderSkeleton,
  RankingTableSkeleton,
} from "@/components/skeletons/list-skeletons";

export default function RankingLoading() {
  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-4xl px-4 py-10">
        <PageHeaderSkeleton />
        <div className="mt-8 rounded-xl border border-dorado-copa/20 p-4">
          <RankingTableSkeleton count={15} />
        </div>
      </main>
    </>
  );
}
