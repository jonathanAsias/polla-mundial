import { AppHeader } from "@/components/layout/app-header";
import {
  PageHeaderSkeleton,
  TeamGridSkeleton,
} from "@/components/skeletons/list-skeletons";

export default function TeamsLoading() {
  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <PageHeaderSkeleton />
        <div className="mt-10 space-y-12">
          {Array.from({ length: 3 }).map((_, i) => (
            <section key={i}>
              <div className="mb-4 h-7 w-24 animate-pulse rounded bg-dorado-copa/10" />
              <TeamGridSkeleton count={4} />
            </section>
          ))}
        </div>
      </main>
    </>
  );
}
