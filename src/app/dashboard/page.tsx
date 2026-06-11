import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, total_points")
    .eq("id", user.id)
    .single<{ username: string; total_points: number }>();

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="font-display text-4xl text-dorado-copa">DASHBOARD</h1>
      <p className="mt-2 text-blanco-linea/70">
        Bienvenido,{" "}
        <span className="font-mono text-dorado-copa">
          @{profile?.username ?? "usuario"}
        </span>
      </p>

      <div className="mt-8 rounded-xl border border-dorado-copa/20 bg-gris-estadio p-6">
        <p className="font-mono text-sm text-blanco-linea/60">Puntos totales</p>
        <p className="font-mono text-4xl font-bold text-dorado-copa">
          {profile?.total_points ?? 0}
        </p>
        <p className="mt-4 text-sm text-blanco-linea/50">
          Los partidos del día se mostrarán aquí en la Fase 4.
        </p>
      </div>

      <Link
        href="/"
        className={cn(buttonVariants({ variant: "outline" }), "mt-8")}
      >
        Volver al inicio
      </Link>
    </main>
  );
}
