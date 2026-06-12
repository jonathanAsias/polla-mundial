import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

config({ path: ".env.local" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

const UPDATES: {
  username: string;
  externalId: number;
  home: number;
  away: number;
}[] = [
  { username: "fer", externalId: 1, home: 1, away: 0 },
  { username: "fer", externalId: 2, home: 0, away: 0 },
  { username: "jonatan", externalId: 1, home: 2, away: 0 },
  { username: "jonatan", externalId: 2, home: 1, away: 0 },
];

async function main() {
  const { data: profiles, error: profileError } = await supabase
    .from("profiles")
    .select("id, username");

  if (profileError) throw profileError;

  const { data: matches, error: matchError } = await supabase
    .from("matches")
    .select("id, external_id")
    .in("external_id", [1, 2]);

  if (matchError) throw matchError;

  const matchByExternal = new Map(
    (matches ?? []).map((m) => [m.external_id, m.id])
  );

  function findProfile(username: string) {
    const lower = username.toLowerCase();
    return profiles?.find((p) => p.username.toLowerCase() === lower)
      ?? profiles?.find((p) => p.username.toLowerCase().includes(lower));
  }

  for (const row of UPDATES) {
    const profile = findProfile(row.username);
    const matchId = matchByExternal.get(row.externalId);

    if (!profile) {
      console.error(`Usuario no encontrado: ${row.username}`);
      continue;
    }
    if (!matchId) {
      console.error(`Partido no encontrado: external_id ${row.externalId}`);
      continue;
    }

    const { data: existing } = await supabase
      .from("predictions")
      .select("id")
      .eq("user_id", profile.id)
      .eq("match_id", matchId)
      .maybeSingle();

    if (existing?.id) {
      const { error } = await supabase
        .from("predictions")
        .update({
          predicted_home: row.home,
          predicted_away: row.away,
          submitted_at: new Date().toISOString(),
        })
        .eq("id", existing.id);

      if (error) throw error;
      console.log(
        `Actualizado @${profile.username} partido #${row.externalId}: ${row.home}-${row.away}`
      );
    } else {
      const { error } = await supabase.from("predictions").insert({
        user_id: profile.id,
        match_id: matchId,
        predicted_home: row.home,
        predicted_away: row.away,
      });

      if (error) throw error;
      console.log(
        `Creado @${profile.username} partido #${row.externalId}: ${row.home}-${row.away}`
      );
    }
  }

  console.log("Listo.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
