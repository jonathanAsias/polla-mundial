const API_BASE = "https://v3.football.api-sports.io";
const WORLD_CUP_LEAGUE_ID = 1;

export interface ApiFootballFixture {
  fixture: {
    id: number;
    date: string;
    status: { short: string };
  };
  league?: {
    id: number;
    name: string;
    season: number;
  };
  teams: {
    home: { id: number; name: string; winner?: boolean | null };
    away: { id: number; name: string; winner?: boolean | null };
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

export function getFixtureWinnerSide(
  fixture: ApiFootballFixture
): "home" | "away" | null {
  if (fixture.teams.home.winner === true) return "home";
  if (fixture.teams.away.winner === true) return "away";
  return null;
}

export async function fetchFixturesByDate(
  date: string
): Promise<ApiFootballFixture[]> {
  const apiKey = process.env.API_FOOTBALL_KEY;
  if (!apiKey) throw new Error("API_FOOTBALL_KEY no configurada");

  const url = `${API_BASE}/fixtures?date=${date}`;
  const res = await fetch(url, {
    headers: { "x-apisports-key": apiKey },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`API-Football error: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  return (json.response ?? []) as ApiFootballFixture[];
}

export function isWorldCupFixture(fixture: ApiFootballFixture): boolean {
  return (
    fixture.league?.id === WORLD_CUP_LEAGUE_ID ||
    (fixture.league?.name?.toLowerCase().includes("world cup") ?? false)
  );
}

/** Plan gratuito: temporada 2026 no disponible por league+season; usar por fecha. */
export async function fetchWorldCupFixturesForDates(
  dates: string[]
): Promise<ApiFootballFixture[]> {
  const uniqueDates = Array.from(new Set(dates));
  const fixtures: ApiFootballFixture[] = [];

  for (const date of uniqueDates) {
    const dayFixtures = await fetchFixturesByDate(date);
    fixtures.push(...dayFixtures.filter(isWorldCupFixture));
  }

  return fixtures;
}

export async function fetchWorldCupFixtures(
  season = 2026
): Promise<ApiFootballFixture[]> {
  const apiKey = process.env.API_FOOTBALL_KEY;
  const leagueId = process.env.API_FOOTBALL_LEAGUE_ID ?? String(WORLD_CUP_LEAGUE_ID);

  if (!apiKey) {
    throw new Error("API_FOOTBALL_KEY no configurada");
  }

  const url = `${API_BASE}/fixtures?league=${leagueId}&season=${season}`;
  const res = await fetch(url, {
    headers: {
      "x-apisports-key": apiKey,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`API-Football error: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  const fixtures = (json.response ?? []) as ApiFootballFixture[];

  if (fixtures.length === 0 && json.errors) {
    console.warn("API-Football league/season vacío:", json.errors);
  }

  return fixtures;
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
