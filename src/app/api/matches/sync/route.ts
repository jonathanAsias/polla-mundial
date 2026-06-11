import { NextResponse } from "next/server";
import { verifyCronAuth } from "@/lib/cron-auth";
import { syncMatchResults } from "@/lib/matches-sync";

export async function POST(request: Request) {
  const authError = verifyCronAuth(request);
  if (authError) return authError;

  try {
    const result = await syncMatchResults();
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    console.error("sync error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error de sync" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  return POST(request);
}
