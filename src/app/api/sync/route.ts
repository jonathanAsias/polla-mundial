import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { runResultsSync } from "@/lib/run-sync";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  try {
    const { sync, points } = await runResultsSync();

    return NextResponse.json({
      ok: true,
      sync,
      points,
    });
  } catch (error) {
    console.error("sync error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error de sincronización" },
      { status: 500 }
    );
  }
}
