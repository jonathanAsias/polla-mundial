const API_BASE = "https://v3.football.api-sports.io";

export interface ApiFootballFixture {
  fixture: {
    id: number;
    date: string;
    status: { short: string };
  };
  teams: {
    home: { id: number; name: string };
    away: { id: number; name: string };
  };
  goals: {
    home: number | null;
    away: number | null;
  };
}

function mapStatus(short: string): "upcoming" | "live" | "finished" {
  const live = new Set(["1H", "2H", "HT", "ET", "BT", "P", "LIVE", "INT"]);
  const finished = new Set(["FT", "AET", "PEN", "AWD", "WO"]);
  if (finished.has(short)) return "finished";
  if (live.has(short)) return "live";
  return "upcoming";
}

export function parseFixtureStatus(short: string) {
  return mapStatus(short);
}

export async function fetchWorldCupFixtures(
  season = 2026
): Promise<ApiFootballFixture[]> {
  const apiKey = process.env.API_FOOTBALL_KEY;
  const leagueId = process.env.API_FOOTBALL_LEAGUE_ID ?? "1";

  if (!apiKey) {
    throw new Error("API_FOOTBALL_KEY no configurada");
  }

  const url = `${API_BASE}/fixtures?league=${leagueId}&season=${season}`;
  const res = await fetch(url, {
    headers: {
      "x-apisports-key": apiKey,
    },
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    throw new Error(`API-Football error: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  return (json.response ?? []) as ApiFootballFixture[];
}

export async function fetchFixtureById(
  fixtureId: number
): Promise<ApiFootballFixture | null> {
  const apiKey = process.env.API_FOOTBALL_KEY;
  if (!apiKey) throw new Error("API_FOOTBALL_KEY no configurada");

  const res = await fetch(`${API_BASE}/fixtures?id=${fixtureId}`, {
    headers: { "x-apisports-key": apiKey },
    next: { revalidate: 0 },
  });

  if (!res.ok) return null;
  const json = await res.json();
  return (json.response?.[0] as ApiFootballFixture) ?? null;
}
