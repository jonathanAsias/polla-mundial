import { AppHeader } from "@/components/layout/app-header";
import {
  PageHeaderSkeleton,
  ProfileSkeleton,
} from "@/components/skeletons/list-skeletons";

export default function ProfileLoading() {
  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <PageHeaderSkeleton />
        <div className="mt-8">
          <ProfileSkeleton />
        </div>
      </main>
    </>
  );
}
