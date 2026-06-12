/**
 * Marca resultados de apertura y recalcula puntos.
 * Ajusta OPENING_RESULTS si los marcadores reales fueron otros.
 *
 * Uso: npx tsx scripts/finalize-opening-matches.ts
 */
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { calculatePointsForMatch } from "../src/lib/points-service";

config({ path: ".env.local" });

const OPENING_RESULTS: {
  externalId: number;
  home: number;
  away: number;
}[] = [
  { externalId: 1, home: 2, away: 0 },
  { externalId: 2, home: 0, away: 0 },
];

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Faltan variables Supabase en .env.local");

  const supabase = createClient(url, key);

  for (const result of OPENING_RESULTS) {
    const { data: match, error } = await supabase
      .from("matches")
      .select("id, external_id")
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

    console.log(
      `Partido #${result.externalId} → ${result.home}-${result.away} (finalizado)`
    );

    const calc = await calculatePointsForMatch(match.id);
    console.log(`  Puntos recalculados para ${calc.updated} predicciones`);
  }

  console.log("Listo.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
