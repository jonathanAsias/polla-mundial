/**
 * Actualiza resultados oficiales FIFA y recalcula puntos.
 * Uso: npx tsx scripts/update-fifa-results.ts
 */
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { calculatePointsForMatch } from "../src/lib/points-service";
import { recordResultsSync, touchMatchResultsUpdated } from "../src/lib/sync-meta";

config({ path: ".env.local" });

const FIFA_RESULTS = [
  { externalId: 1, home: 2, away: 0, label: "México 2-0 Sudáfrica" },
  { externalId: 2, home: 2, away: 1, label: "Corea del Sur 2-1 Chequia" },
];

async function main() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const now = new Date();

  for (const result of FIFA_RESULTS) {
    const { data: match, error } = await supabase
      .from("matches")
      .select("id")
      .eq("external_id", result.externalId)
      .single();

    if (error || !match) {
      console.error(`Partido #${result.externalId} no encontrado`);
      continue;
    }

    const { error: updateError } = await supabase
      .from("matches")
      .update({
        home_score: result.home,
        away_score: result.away,
        status: "finished",
      })
      .eq("id", match.id);

    if (updateError) throw updateError;

    console.log(`✓ ${result.label}`);

    const calc = await calculatePointsForMatch(match.id);
    console.log(`  Puntos recalculados: ${calc.updated} predicciones`);

    await touchMatchResultsUpdated(match.id, now);
  }

  await recordResultsSync("Resultados oficiales FIFA", now);
  console.log("Sincronización registrada (si app_settings existe).");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
