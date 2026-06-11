import { NextResponse } from "next/server";
import { verifyCronAuth } from "@/lib/cron-auth";
import { calculatePointsForMatch } from "@/lib/points-service";

export async function POST(request: Request) {
  const authError = verifyCronAuth(request);
  if (authError) return authError;

  const body = await request.json().catch(() => ({}));
  const matchId = Number(body.matchId);

  if (!matchId || Number.isNaN(matchId)) {
    return NextResponse.json({ error: "matchId requerido" }, { status: 400 });
  }

  try {
    const result = await calculatePointsForMatch(matchId);
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error" },
      { status: 500 }
    );
  }
}
