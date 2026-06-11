import Link from "next/link";
import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/matches", label: "Partidos" },
  { href: "/teams", label: "Equipos" },
  { href: "/ranking", label: "Ranking" },
  { href: "/profile", label: "Perfil" },
];

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-dorado-copa/20 bg-negro-noche/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-dorado-copa" />
          <span className="font-display text-lg tracking-wide text-dorado-copa">
            POLLA 2026
          </span>
        </Link>

        <nav className="hidden items-center gap-1 sm:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "text-blanco-linea/80 hover:text-dorado-copa"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/auth/login"
          className={cn(buttonVariants({ size: "sm" }), "text-xs")}
        >
          Entrar
        </Link>
      </div>
    </header>
  );
}
