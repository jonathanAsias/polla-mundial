import { syncMatchResults } from "@/lib/matches-sync";
import { settleAllFinishedMatches } from "@/lib/points-service";

export async function runResultsSync() {
  const sync = await syncMatchResults();
  const points = await settleAllFinishedMatches();

  return { sync, points };
}
