/**
 * Alinea horarios FIFA de todos los partidos desde API-Football.
 * Uso: npx tsx scripts/sync-world-cup-schedules.ts
 */
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import {
  fetchFixturesByDate,
  isWorldCupFixture,
  type ApiFootballFixture,
} from "../src/lib/api-football";
import { apiTeamNameToCode } from "../src/lib/team-api-aliases";

config({ path: ".env.local" });

const DATES = Array.from({ length: 40 }, (_, i) => {
  const d = new Date(Date.UTC(2026, 5, 11 + i));
  return d.toISOString().slice(0, 10);
});

async function main() {
  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const fixtures: ApiFootballFixture[] = [];
  for (const date of DATES) {
    const day = await fetchFixturesByDate(date);
    fixtures.push(...day.filter(isWorldCupFixture));
    process.stdout.write(".");
  }
  console.log(`\n${fixtures.length} fixtures API`);

  const { data: matches } = await sb
    .from("matches")
    .select(
      `
      id, external_id, scheduled_at,
      home_team:teams!matches_home_team_id_fkey(code),
      away_team:teams!matches_away_team_id_fkey(code)
    `
    );

  let updated = 0;
  for (const row of matches ?? []) {
    const match = row as unknown as {
      id: number;
      external_id: number | null;
      scheduled_at: string;
      home_team: { code: string };
      away_team: { code: string };
    };
    const home = match.home_team.code;
    const away = match.away_team.code;
    if (home === "TBD" || away === "TBD") continue;

    const fixture = fixtures.find((f) => {
      const fHome = apiTeamNameToCode(f.teams.home.name);
      const fAway = apiTeamNameToCode(f.teams.away.name);
      return fHome === home && fAway === away;
    });

    if (!fixture) continue;

    const kickoff = new Date(fixture.fixture.date).toISOString();
    if (kickoff === new Date(match.scheduled_at).toISOString()) continue;

    const { error } = await sb
      .from("matches")
      .update({ scheduled_at: kickoff })
      .eq("id", match.id);

    if (!error) {
      updated++;
      console.log(`✓ #${match.external_id} ${home} vs ${away} → ${kickoff}`);
    }
  }

  console.log(`Actualizados: ${updated}`);
}

main();
