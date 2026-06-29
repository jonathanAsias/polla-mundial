import type { MatchPhase } from "@/types/database";
import { getTournamentCalendarDay } from "@/lib/timezone";

/** Fase activa del torneo según fecha calendario FIFA. */
export function getActiveTournamentPhase(day?: string | null): MatchPhase {
  const calendarDay = day ?? getTournamentCalendarDay();
  if (!calendarDay) return "group";

  if (calendarDay <= "2026-06-27") return "group";
  if (calendarDay <= "2026-07-03") return "r32";
  if (calendarDay <= "2026-07-07") return "r16";
  if (calendarDay <= "2026-07-12") return "qf";
  if (calendarDay <= "2026-07-17") return "sf";
  return "final";
}

export function isKnockoutPhase(phase: MatchPhase): boolean {
  return phase !== "group";
}
