import { syncMatchResults } from "@/lib/matches-sync";

/** Sincroniza resultados y horarios FIFA; recalcula puntos solo de partidos actualizados. */
export async function runResultsSync() {
  const sync = await syncMatchResults();
  return { sync };
}
