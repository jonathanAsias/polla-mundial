"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/matches", label: "Partidos" },
  { href: "/teams", label: "Equipos" },
  { href: "/ranking", label: "Ranking" },
  { href: "/profile", label: "Perfil" },
];

interface AppNavProps {
  isAuthenticated: boolean;
}

export function AppNav({ isAuthenticated }: AppNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  const linkClass = (href: string) =>
    cn(
      buttonVariants({ variant: "ghost", size: "sm" }),
      "justify-start text-blanco-linea/80 hover:text-dorado-copa",
      pathname === href && "bg-dorado-copa/15 text-dorado-copa"
    );

  return (
    <>
      <nav className="hidden items-center gap-1 sm:flex">
        {NAV_LINKS.map((link) => (
          <Link key={link.href} href={link.href} className={linkClass(link.href)}>
            {link.label}
          </Link>
        ))}
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
            className={cn(buttonVariants({ size: "sm" }), "hidden text-xs sm:inline-flex")}
          >
            Entrar
          </Link>
        )}

        <button
          type="button"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "sm:hidden"
          )}
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="absolute inset-x-0 top-14 border-b border-dorado-copa/20 bg-negro-noche/98 px-4 py-4 sm:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={linkClass(link.href)}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleLogout}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "justify-start text-blanco-linea/70"
                )}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar sesión
              </button>
            ) : (
              <Link
                href="/auth/login"
                className={cn(buttonVariants({ size: "sm" }), "mt-2")}
                onClick={() => setOpen(false)}
              >
                Entrar
              </Link>
            )}
          </nav>
        </div>
      )}
    </>
  );
}
