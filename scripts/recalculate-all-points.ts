/**
 * Recalcula puntos de todos los partidos finalizados y totales de perfiles.
 * Uso: npx tsx scripts/recalculate-all-points.ts
 */
import { config } from "dotenv";
import {
  recalculateAllUserTotals,
  settleAllFinishedMatches,
} from "../src/lib/points-service";

config({ path: ".env.local" });

async function main() {
  const result = await settleAllFinishedMatches();
  console.log("Partidos procesados:", result);
  const users = await recalculateAllUserTotals();
  console.log("Perfiles actualizados:", users);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
