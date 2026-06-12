import { createServiceClient } from "@/lib/supabase/server";

const LAST_SYNC_KEY = "last_results_sync_at";
const LAST_SYNC_SOURCE_KEY = "last_results_sync_source";

export interface ResultsSyncStatus {
  lastUpdatedAt: string | null;
  source: string | null;
  latestMatchUpdate: string | null;
}

export async function recordResultsSync(
  source: string,
  at: Date = new Date()
) {
  const supabase = createServiceClient();
  const iso = at.toISOString();

  const { error } = await supabase.from("app_settings").upsert(
    [
      { key: LAST_SYNC_KEY, value: iso, updated_at: iso },
      { key: LAST_SYNC_SOURCE_KEY, value: source, updated_at: iso },
    ],
    { onConflict: "key" }
  );

  if (error) {
    console.warn("app_settings no disponible:", error.message);
  }
}

export async function getResultsSyncStatus(): Promise<ResultsSyncStatus> {
  const supabase = createServiceClient();

  let lastUpdatedAt: string | null = null;
  let source: string | null = null;
  let latestMatchUpdate: string | null = null;

  const { data: settings, error: settingsError } = await supabase
    .from("app_settings")
    .select("key, value")
    .in("key", [LAST_SYNC_KEY, LAST_SYNC_SOURCE_KEY]);

  if (!settingsError && settings) {
    const map = new Map(settings.map((s) => [s.key, s.value]));
    lastUpdatedAt = map.get(LAST_SYNC_KEY) ?? null;
    source = map.get(LAST_SYNC_SOURCE_KEY) ?? null;
  }

  const { data: latestMatch, error: matchError } = await supabase
    .from("matches")
    .select("results_updated_at")
    .not("results_updated_at", "is", null)
    .order("results_updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!matchError && latestMatch) {
    latestMatchUpdate = latestMatch.results_updated_at ?? null;
  }

  return { lastUpdatedAt, source, latestMatchUpdate };
}

export async function touchMatchResultsUpdated(
  matchId: number,
  at: Date = new Date()
) {
  const supabase = createServiceClient();
  const iso = at.toISOString();

  const { error } = await supabase
    .from("matches")
    .update({ results_updated_at: iso })
    .eq("id", matchId);

  if (error) {
    console.warn("results_updated_at no disponible:", error.message);
  }
}
