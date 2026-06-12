import { NextResponse } from "next/server";
import { verifyCronAuth } from "@/lib/cron-auth";
import { syncMatchResults } from "@/lib/matches-sync";
import {
  settleAllFinishedMatches,
  settleDayJornadaPoints,
} from "@/lib/points-service";
import { sendDailyPushReminders } from "@/lib/push-service";
import { getPreviousCalendarDayInTimezone } from "@/lib/timezone";

/**
 * Cron diario (medianoche Ciudad de México):
 * 1. Sincroniza resultados desde API-Football
 * 2. Cierra jornada: predicciones vs resultados finales del día
 * 3. Recalcula todos los partidos finalizados (respaldo)
 * 4. Recordatorios push de la nueva jornada
 */
export async function GET(request: Request) {
  const authError = verifyCronAuth(request);
  if (authError) return authError;

  try {
    const sync = await syncMatchResults().catch((e) => ({
      error: e instanceof Error ? e.message : "sync failed",
    }));

    const jornada = await settleDayJornadaPoints(
      getPreviousCalendarDayInTimezone()
    ).catch((e) => ({
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
