import { createClient } from "@/lib/supabase/server";
import type { Team } from "@/types/database";

export async function getAllTeams() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("teams")
    .select("*")
    .neq("code", "TBD")
    .order("group_name", { ascending: true })
    .order("name", { ascending: true });

  if (error) throw error;
  return (data ?? []) as Team[];
}

export async function getTeamByCode(code: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("teams")
    .select("*")
    .eq("code", code)
    .single();

  if (error) return null;
  return data as Team;
}

export async function getTeamGroupMatches(teamId: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("matches")
    .select(
      `
      id, phase, scheduled_at, home_score, away_score, status, external_id, venue, city,
      home_team:teams!matches_home_team_id_fkey(id, name, code, flag_emoji),
      away_team:teams!matches_away_team_id_fkey(id, name, code, flag_emoji)
    `
    )
    .eq("phase", "group")
    .or(`home_team_id.eq.${teamId},away_team_id.eq.${teamId}`)
    .order("scheduled_at", { ascending: true });

  if (error) throw error;
  return data ?? [];
}
