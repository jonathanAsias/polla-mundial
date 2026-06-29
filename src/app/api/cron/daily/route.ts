import { NextResponse } from "next/server";
import { verifyCronAuth } from "@/lib/cron-auth";
import { syncMatchResults } from "@/lib/matches-sync";
import {
  settleAllFinishedMatches,
  settleDayJornadaPoints,
} from "@/lib/points-service";
import { sendDailyPushReminders } from "@/lib/push-service";
import { getTournamentCalendarDay } from "@/lib/timezone";

/**
 * Cron cada 3 h durante el torneo:
 * 1. Sincroniza calendario y resultados desde API-Football (día FIFA actual)
 * 2. Cierra jornada anterior (puntos)
 * 3. Recalcula partidos finalizados
 * 4. Recordatorios push
 */
export async function GET(request: Request) {
  const authError = verifyCronAuth(request);
  if (authError) return authError;

  if (!getTournamentCalendarDay()) {
    return NextResponse.json({ ok: true, skipped: "Fuera del torneo" });
  }

  try {
    const sync = await syncMatchResults().catch((e) => ({
      error: e instanceof Error ? e.message : "sync failed",
    }));

    const yesterday = new Date();
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);

    const jornada = await settleDayJornadaPoints(yesterday).catch((e) => ({
      error: e instanceof Error ? e.message : "settle jornada failed",
    }));

    const allFinished = await settleAllFinishedMatches().catch((e) => ({
      error: e instanceof Error ? e.message : "settle all failed",
    }));

    const push = await sendDailyPushReminders().catch((e) => ({
      error: e instanceof Error ? e.message : "push failed",
    }));

    return NextResponse.json({
      ok: true,
      sync,
      jornada,
      allFinished,
      push,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  return GET(request);
}
