import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { TEAMS } from "../src/data/teams";
import { MATCHES } from "../src/data/matches";

config({ path: ".env.local" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local");
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

async function seed() {
  console.log("Limpiando datos existentes...");
  const { error: delMatches } = await supabase.from("matches").delete().gte("id", 0);
  if (delMatches) throw delMatches;

  const { error: delTeams } = await supabase.from("teams").delete().gte("id", 0);
  if (delTeams) throw delTeams;

  console.log(`Insertando ${TEAMS.length} equipos...`);
  const { data: teams, error: teamsError } = await supabase
    .from("teams")
    .insert(
      TEAMS.map((t) => ({
        name: t.name,
        code: t.code,
        flag_emoji: t.flag_emoji,
        group_name: t.group_name,
      }))
    )
    .select("id, code");

  if (teamsError) throw teamsError;

  const codeToId = new Map(teams!.map((t) => [t.code, t.id]));

  console.log(`Insertando ${MATCHES.length} partidos...`);
  const matchRows = MATCHES.map((m) => {
    const homeId = codeToId.get(m.home);
    const awayId = codeToId.get(m.away);
    if (!homeId || !awayId) {
      throw new Error(`Equipo no encontrado: ${m.home} o ${m.away} (partido ${m.external_id})`);
    }
    return {
      home_team_id: homeId,
      away_team_id: awayId,
      phase: m.phase,
      scheduled_at: m.scheduled_at,
      venue: m.venue,
      city: m.city,
      external_id: m.external_id,
      status: "upcoming" as const,
    };
  });

  const { error: matchesError } = await supabase.from("matches").insert(matchRows);
  if (matchesError) throw matchesError;

  console.log("Seed completado.");
  console.log(`  Equipos: ${teams!.length}`);
  console.log(`  Partidos: ${matchRows.length}`);
}

seed().catch((err) => {
  console.error("Error en seed:", err);
  process.exit(1);
});
