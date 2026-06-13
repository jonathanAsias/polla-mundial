"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { SyncMenuButton } from "@/components/layout/sync-menu-button";
import { createClient } from "@/lib/supabase/client";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/matches", label: "Partidos" },
  { href: "/teams", label: "Equipos" },
  { href: "/ranking", label: "Ranking" },
  { href: "/reglas", label: "Reglas" },
  { href: "/profile", label: "Perfil" },
];

interface AppNavProps {
  isAuthenticated: boolean;
}

export function AppNav({ isAuthenticated }: AppNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  const desktopLinkClass = (href: string) =>
    cn(
      buttonVariants({ variant: "ghost", size: "sm" }),
      "justify-start text-blanco-linea/80 hover:text-dorado-copa",
      pathname === href && "bg-dorado-copa/15 text-dorado-copa"
    );

  const mobileLinkClass = (href: string) =>
    cn(
      "flex w-full items-center rounded-lg px-4 py-3.5 text-base font-medium transition-colors",
      pathname === href
        ? "bg-dorado-copa/25 text-dorado-copa"
        : "text-blanco-linea hover:bg-gris-estadio active:bg-gris-estadio"
    );

  return (
    <>
      <nav className="hidden items-center gap-1 sm:flex">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={desktopLinkClass(link.href)}
          >
            {link.label}
          </Link>
        ))}
        {isAuthenticated ? <SyncMenuButton /> : null}
      </nav>

      <div className="flex items-center gap-2">
        {isAuthenticated ? (
          <button
            type="button"
            onClick={handleLogout}
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "hidden text-blanco-linea/70 sm:inline-flex"
            )}
            aria-label="Cerrar sesión"
          >
            <LogOut className="h-4 w-4" />
          </button>
        ) : (
          <Link
            href="/auth/login"
            className={cn(
              buttonVariants({ size: "sm" }),
              "hidden text-xs sm:inline-flex"
            )}
          >
            Entrar
          </Link>
        )}

        <button
          type="button"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "text-blanco-linea sm:hidden"
          )}
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 top-14 z-40 bg-black/75 sm:hidden"
            aria-label="Cerrar menú"
            onClick={() => setOpen(false)}
          />

          <div className="fixed left-0 right-0 top-14 z-50 border-b border-dorado-copa/30 bg-negro-noche shadow-2xl sm:hidden">
            <nav className="mx-auto max-w-6xl divide-y divide-dorado-copa/15 px-3 py-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={mobileLinkClass(link.href)}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              <div className="py-2">
                {isAuthenticated ? (
                  <>
                    <SyncMenuButton
                      variant="mobile"
                      onDone={() => setOpen(false)}
                    />
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="mt-1 flex w-full items-center rounded-lg px-4 py-3.5 text-base font-medium text-blanco-linea transition-colors hover:bg-gris-estadio active:bg-gris-estadio"
                    >
                      <LogOut className="mr-3 h-5 w-5 shrink-0" />
                      Cerrar sesión
                    </button>
                  </>
                ) : (
                  <Link
                    href="/auth/login"
                    className={cn(
                      buttonVariants({ size: "lg" }),
                      "w-full justify-center"
                    )}
                    onClick={() => setOpen(false)}
                  >
                    Entrar
                  </Link>
                )}
              </div>
            </nav>
          </div>
        </>
      )}
    </>
  );
}
