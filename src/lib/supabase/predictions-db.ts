import type { Prediction } from "@/types/database";
import type { SupabaseClient } from "@supabase/supabase-js";

type LooseClient = SupabaseClient;

export async function upsertPrediction(
  supabase: SupabaseClient,
  row: {
    user_id: string;
    match_id: number;
    predicted_home: number;
    predicted_away: number;
    submitted_at: string;
  }
): Promise<{ data: Prediction | null; error: { message: string } | null }> {
  const db = supabase as LooseClient;

  const { data: existing } = await db
    .from("predictions")
    .select("id")
    .eq("user_id", row.user_id)
    .eq("match_id", row.match_id)
    .maybeSingle();

  if (existing?.id) {
    return db
      .from("predictions")
      .update({
        predicted_home: row.predicted_home,
        predicted_away: row.predicted_away,
        submitted_at: row.submitted_at,
      })
      .eq("id", existing.id)
      .select()
      .single();
  }

  return db.from("predictions").insert(row).select().single();
}
