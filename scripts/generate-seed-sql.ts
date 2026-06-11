import { writeFileSync } from "fs";
import { TEAMS } from "../src/data/teams";
import { MATCHES } from "../src/data/matches";

function esc(value: string) {
  return value.replace(/'/g, "''");
}

const teamRows = TEAMS.map(
  (t) =>
    `  ('${esc(t.name)}', '${t.code}', '${t.flag_emoji}', '${esc(t.group_name)}')`
).join(",\n");

const matchRows = MATCHES.map(
  (m) =>
    `  ((SELECT id FROM teams WHERE code='${m.home}'), (SELECT id FROM teams WHERE code='${m.away}'), '${m.phase}', '${m.scheduled_at}', '${esc(m.venue)}', '${esc(m.city)}', ${m.external_id}, 'upcoming')`
).join(",\n");

const sql = `-- Polla Mundialista 2026 — Seed data
-- Ejecutar en Supabase SQL Editor después de schema.sql

DELETE FROM predictions;
DELETE FROM matches;
DELETE FROM teams;

INSERT INTO teams (name, code, flag_emoji, group_name) VALUES
${teamRows};

INSERT INTO matches (home_team_id, away_team_id, phase, scheduled_at, venue, city, external_id, status) VALUES
${matchRows};
`;

writeFileSync("supabase/seed.sql", sql);
console.log(
  `supabase/seed.sql generado: ${TEAMS.length} equipos, ${MATCHES.length} partidos`
);
