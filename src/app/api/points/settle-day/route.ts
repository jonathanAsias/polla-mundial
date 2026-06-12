import { NextResponse } from "next/server";
import { verifyCronAuth } from "@/lib/cron-auth";
import {
  settleAllFinishedMatches,
  settleDayJornadaPoints,
} from "@/lib/points-service";
import { getPreviousCalendarDayInTimezone } from "@/lib/timezone";

export async function POST(request: Request) {
  const authError = verifyCronAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json().catch(() => ({}));
    const settleAll = body.all === true;

    const jornada = await settleDayJornadaPoints(
      getPreviousCalendarDayInTimezone()
    );
    const all = settleAll ? await settleAllFinishedMatches() : null;

    return NextResponse.json({ ok: true, jornada, all });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  return POST(request);
}
