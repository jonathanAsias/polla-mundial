import Link from "next/link";
import { Trophy } from "lucide-react";
import { AppNav } from "@/components/layout/app-nav";
import { createClient } from "@/lib/supabase/server";

export async function AppHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 border-b border-dorado-copa/20 bg-negro-noche/95 backdrop-blur">
      <div className="relative mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-dorado-copa" />
          <span className="font-display text-lg tracking-wide text-dorado-copa">
            POLLA 2026
          </span>
        </Link>

        <AppNav isAuthenticated={!!user} />
      </div>
    </header>
  );
}
