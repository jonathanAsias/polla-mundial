import { AppHeader } from "@/components/layout/app-header";
import {
  MatchRowSkeleton,
  PageHeaderSkeleton,
} from "@/components/skeletons/list-skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function MatchesLoading() {
  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-4xl px-4 py-10">
        <PageHeaderSkeleton />
        <div className="mt-8 space-y-6">
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-20 rounded-lg" />
            ))}
          </div>
          <MatchRowSkeleton count={8} />
        </div>
      </main>
    </>
  );
}
