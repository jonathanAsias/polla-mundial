import type { MatchPhase } from "@/types/database";

export interface SeedMatch {
  external_id: number;
  home: string;
  away: string;
  phase: MatchPhase;
  scheduled_at: string;
  venue: string;
  city: string;
  label?: string;
}

/** Horarios en UTC — calendario FIFA 2026 (fase de grupos + eliminatoria) */
export const MATCHES: SeedMatch[] = [
  // Fase de grupos (72 partidos)
  { external_id: 1, home: "MEX", away: "RSA", phase: "group", scheduled_at: "2026-06-11T19:00:00Z", venue: "Estadio Azteca", city: "Ciudad de México" },
  { external_id: 2, home: "KOR", away: "CZE", phase: "group", scheduled_at: "2026-06-12T02:00:00Z", venue: "Estadio Akron", city: "Guadalajara" },
  { external_id: 3, home: "CAN", away: "BIH", phase: "group", scheduled_at: "2026-06-12T19:00:00Z", venue: "BMO Field", city: "Toronto" },
  { external_id: 4, home: "USA", away: "PAR", phase: "group", scheduled_at: "2026-06-13T01:00:00Z", venue: "SoFi Stadium", city: "Los Angeles" },
  { external_id: 5, home: "HAI", away: "SCO", phase: "group", scheduled_at: "2026-06-14T01:00:00Z", venue: "Gillette Stadium", city: "Boston" },
  { external_id: 6, home: "AUS", away: "TUR", phase: "group", scheduled_at: "2026-06-13T04:00:00Z", venue: "BC Place", city: "Vancouver" },
  { external_id: 7, home: "BRA", away: "MAR", phase: "group", scheduled_at: "2026-06-14T00:00:00Z", venue: "MetLife Stadium", city: "New York" },
  { external_id: 8, home: "QAT", away: "SUI", phase: "group", scheduled_at: "2026-06-13T19:00:00Z", venue: "Levi's Stadium", city: "San Francisco" },
  { external_id: 9, home: "CIV", away: "ECU", phase: "group", scheduled_at: "2026-06-14T23:00:00Z", venue: "Lincoln Financial Field", city: "Filadelfia" },
  { external_id: 10, home: "GER", away: "CUW", phase: "group", scheduled_at: "2026-06-14T16:00:00Z", venue: "NRG Stadium", city: "Houston" },
  { external_id: 11, home: "NED", away: "JPN", phase: "group", scheduled_at: "2026-06-14T20:00:00Z", venue: "AT&T Stadium", city: "Dallas" },
  { external_id: 12, home: "SWE", away: "TUN", phase: "group", scheduled_at: "2026-06-15T02:00:00Z", venue: "Estadio BBVA", city: "Monterrey" },
  { external_id: 13, home: "KSA", away: "URU", phase: "group", scheduled_at: "2026-06-15T22:00:00Z", venue: "Hard Rock Stadium", city: "Miami" },
  { external_id: 14, home: "ESP", away: "CPV", phase: "group", scheduled_at: "2026-06-15T16:00:00Z", venue: "Mercedes-Benz Stadium", city: "Atlanta" },
  { external_id: 15, home: "IRN", away: "NZL", phase: "group", scheduled_at: "2026-06-16T01:00:00Z", venue: "SoFi Stadium", city: "Los Angeles" },
  { external_id: 16, home: "BEL", away: "EGY", phase: "group", scheduled_at: "2026-06-15T19:00:00Z", venue: "Lumen Field", city: "Seattle" },
  { external_id: 17, home: "FRA", away: "SEN", phase: "group", scheduled_at: "2026-06-16T19:00:00Z", venue: "MetLife Stadium", city: "New York" },
  { external_id: 18, home: "IRQ", away: "NOR", phase: "group", scheduled_at: "2026-06-16T22:00:00Z", venue: "Gillette Stadium", city: "Boston" },
  { external_id: 19, home: "ARG", away: "ALG", phase: "group", scheduled_at: "2026-06-17T01:00:00Z", venue: "Arrowhead Stadium", city: "Kansas City" },
  { external_id: 20, home: "AUT", away: "JOR", phase: "group", scheduled_at: "2026-06-17T04:00:00Z", venue: "Levi's Stadium", city: "San Francisco" },
  { external_id: 21, home: "GHA", away: "PAN", phase: "group", scheduled_at: "2026-06-17T23:00:00Z", venue: "BMO Field", city: "Toronto" },
  { external_id: 22, home: "ENG", away: "CRO", phase: "group", scheduled_at: "2026-06-17T20:00:00Z", venue: "AT&T Stadium", city: "Dallas" },
  { external_id: 23, home: "POR", away: "COD", phase: "group", scheduled_at: "2026-06-17T16:00:00Z", venue: "NRG Stadium", city: "Houston" },
  { external_id: 24, home: "UZB", away: "COL", phase: "group", scheduled_at: "2026-06-18T02:00:00Z", venue: "Estadio Azteca", city: "Ciudad de México" },
  { external_id: 25, home: "CZE", away: "RSA", phase: "group", scheduled_at: "2026-06-18T16:00:00Z", venue: "Mercedes-Benz Stadium", city: "Atlanta" },
  { external_id: 26, home: "SUI", away: "BIH", phase: "group", scheduled_at: "2026-06-18T19:00:00Z", venue: "SoFi Stadium", city: "Los Angeles" },
  { external_id: 27, home: "CAN", away: "QAT", phase: "group", scheduled_at: "2026-06-18T22:00:00Z", venue: "BC Place", city: "Vancouver" },
  { external_id: 28, home: "MEX", away: "KOR", phase: "group", scheduled_at: "2026-06-19T01:00:00Z", venue: "Estadio Akron", city: "Guadalajara" },
  { external_id: 29, home: "BRA", away: "HAI", phase: "group", scheduled_at: "2026-06-20T01:00:00Z", venue: "Lincoln Financial Field", city: "Filadelfia" },
  { external_id: 30, home: "SCO", away: "MAR", phase: "group", scheduled_at: "2026-06-19T22:00:00Z", venue: "Gillette Stadium", city: "Boston" },
  { external_id: 31, home: "TUR", away: "PAR", phase: "group", scheduled_at: "2026-06-20T03:00:00Z", venue: "Levi's Stadium", city: "San Francisco" },
  { external_id: 32, home: "USA", away: "AUS", phase: "group", scheduled_at: "2026-06-19T19:00:00Z", venue: "Lumen Field", city: "Seattle" },
  { external_id: 33, home: "GER", away: "CIV", phase: "group", scheduled_at: "2026-06-20T20:00:00Z", venue: "BMO Field", city: "Toronto" },
  { external_id: 34, home: "ECU", away: "CUW", phase: "group", scheduled_at: "2026-06-21T00:00:00Z", venue: "Arrowhead Stadium", city: "Kansas City" },
  { external_id: 35, home: "NED", away: "SWE", phase: "group", scheduled_at: "2026-06-20T16:00:00Z", venue: "NRG Stadium", city: "Houston" },
  { external_id: 36, home: "TUN", away: "JPN", phase: "group", scheduled_at: "2026-06-21T04:00:00Z", venue: "Estadio BBVA", city: "Monterrey" },
  { external_id: 37, home: "URU", away: "CPV", phase: "group", scheduled_at: "2026-06-21T22:00:00Z", venue: "Hard Rock Stadium", city: "Miami" },
  { external_id: 38, home: "ESP", away: "KSA", phase: "group", scheduled_at: "2026-06-21T16:00:00Z", venue: "Mercedes-Benz Stadium", city: "Atlanta" },
  { external_id: 39, home: "BEL", away: "IRN", phase: "group", scheduled_at: "2026-06-21T19:00:00Z", venue: "SoFi Stadium", city: "Los Angeles" },
  { external_id: 40, home: "NZL", away: "EGY", phase: "group", scheduled_at: "2026-06-22T01:00:00Z", venue: "BC Place", city: "Vancouver" },
  { external_id: 41, home: "NOR", away: "SEN", phase: "group", scheduled_at: "2026-06-23T00:00:00Z", venue: "MetLife Stadium", city: "New York" },
  { external_id: 42, home: "FRA", away: "IRQ", phase: "group", scheduled_at: "2026-06-22T21:00:00Z", venue: "Lincoln Financial Field", city: "Filadelfia" },
  { external_id: 43, home: "ARG", away: "AUT", phase: "group", scheduled_at: "2026-06-22T16:00:00Z", venue: "AT&T Stadium", city: "Dallas" },
  { external_id: 44, home: "JOR", away: "ALG", phase: "group", scheduled_at: "2026-06-23T03:00:00Z", venue: "Levi's Stadium", city: "San Francisco" },
  { external_id: 45, home: "ENG", away: "GHA", phase: "group", scheduled_at: "2026-06-23T20:00:00Z", venue: "Gillette Stadium", city: "Boston" },
  { external_id: 46, home: "PAN", away: "CRO", phase: "group", scheduled_at: "2026-06-23T23:00:00Z", venue: "BMO Field", city: "Toronto" },
  { external_id: 47, home: "POR", away: "UZB", phase: "group", scheduled_at: "2026-06-23T16:00:00Z", venue: "NRG Stadium", city: "Houston" },
  { external_id: 48, home: "COL", away: "COD", phase: "group", scheduled_at: "2026-06-24T02:00:00Z", venue: "Estadio Akron", city: "Guadalajara" },
  { external_id: 49, home: "SCO", away: "BRA", phase: "group", scheduled_at: "2026-06-24T22:00:00Z", venue: "Hard Rock Stadium", city: "Miami" },
  { external_id: 50, home: "MAR", away: "HAI", phase: "group", scheduled_at: "2026-06-24T22:00:00Z", venue: "Mercedes-Benz Stadium", city: "Atlanta" },
  { external_id: 51, home: "SUI", away: "CAN", phase: "group", scheduled_at: "2026-06-24T19:00:00Z", venue: "BC Place", city: "Vancouver" },
  { external_id: 52, home: "BIH", away: "QAT", phase: "group", scheduled_at: "2026-06-24T19:00:00Z", venue: "Lumen Field", city: "Seattle" },
  { external_id: 53, home: "CZE", away: "MEX", phase: "group", scheduled_at: "2026-06-25T01:00:00Z", venue: "Estadio Azteca", city: "Ciudad de México" },
  { external_id: 54, home: "RSA", away: "KOR", phase: "group", scheduled_at: "2026-06-25T01:00:00Z", venue: "Estadio BBVA", city: "Monterrey" },
  { external_id: 55, home: "CUW", away: "CIV", phase: "group", scheduled_at: "2026-06-25T20:00:00Z", venue: "Lincoln Financial Field", city: "Filadelfia" },
  { external_id: 56, home: "ECU", away: "GER", phase: "group", scheduled_at: "2026-06-25T20:00:00Z", venue: "MetLife Stadium", city: "New York" },
  { external_id: 57, home: "JPN", away: "SWE", phase: "group", scheduled_at: "2026-06-25T22:00:00Z", venue: "AT&T Stadium", city: "Dallas" },
  { external_id: 58, home: "TUN", away: "NED", phase: "group", scheduled_at: "2026-06-25T22:00:00Z", venue: "Arrowhead Stadium", city: "Kansas City" },
  { external_id: 59, home: "TUR", away: "USA", phase: "group", scheduled_at: "2026-06-26T02:00:00Z", venue: "SoFi Stadium", city: "Los Angeles" },
  { external_id: 60, home: "PAR", away: "AUS", phase: "group", scheduled_at: "2026-06-26T02:00:00Z", venue: "Levi's Stadium", city: "San Francisco" },
  { external_id: 61, home: "NOR", away: "FRA", phase: "group", scheduled_at: "2026-06-26T19:00:00Z", venue: "Gillette Stadium", city: "Boston" },
  { external_id: 62, home: "SEN", away: "IRQ", phase: "group", scheduled_at: "2026-06-26T19:00:00Z", venue: "BMO Field", city: "Toronto" },
  { external_id: 63, home: "EGY", away: "IRN", phase: "group", scheduled_at: "2026-06-27T03:00:00Z", venue: "Lumen Field", city: "Seattle" },
  { external_id: 64, home: "NZL", away: "BEL", phase: "group", scheduled_at: "2026-06-27T03:00:00Z", venue: "BC Place", city: "Vancouver" },
  { external_id: 65, home: "CPV", away: "KSA", phase: "group", scheduled_at: "2026-06-27T00:00:00Z", venue: "NRG Stadium", city: "Houston" },
  { external_id: 66, home: "URU", away: "ESP", phase: "group", scheduled_at: "2026-06-27T00:00:00Z", venue: "Estadio Akron", city: "Guadalajara" },
  { external_id: 67, home: "PAN", away: "ENG", phase: "group", scheduled_at: "2026-06-27T21:00:00Z", venue: "MetLife Stadium", city: "New York" },
  { external_id: 68, home: "CRO", away: "GHA", phase: "group", scheduled_at: "2026-06-27T21:00:00Z", venue: "Lincoln Financial Field", city: "Filadelfia" },
  { external_id: 69, home: "ALG", away: "AUT", phase: "group", scheduled_at: "2026-06-28T02:00:00Z", venue: "Arrowhead Stadium", city: "Kansas City" },
  { external_id: 70, home: "JOR", away: "ARG", phase: "group", scheduled_at: "2026-06-28T02:00:00Z", venue: "AT&T Stadium", city: "Dallas" },
  { external_id: 71, home: "COL", away: "POR", phase: "group", scheduled_at: "2026-06-28T23:30:00Z", venue: "Hard Rock Stadium", city: "Miami" },
  { external_id: 72, home: "COD", away: "UZB", phase: "group", scheduled_at: "2026-06-28T23:30:00Z", venue: "Mercedes-Benz Stadium", city: "Atlanta" },

  // Eliminatoria (32 partidos)
  { external_id: 73, home: "TBD", away: "TBD", phase: "r32", scheduled_at: "2026-06-28T19:00:00Z", venue: "SoFi Stadium", city: "Los Angeles", label: "2º Grupo A vs 2º Grupo B" },
  { external_id: 74, home: "TBD", away: "TBD", phase: "r32", scheduled_at: "2026-06-29T20:30:00Z", venue: "Gillette Stadium", city: "Boston", label: "1º Grupo E vs 3º A/B/C/D/F" },
  { external_id: 75, home: "TBD", away: "TBD", phase: "r32", scheduled_at: "2026-06-30T01:00:00Z", venue: "Estadio BBVA", city: "Monterrey", label: "1º Grupo F vs 2º Grupo C" },
  { external_id: 76, home: "TBD", away: "TBD", phase: "r32", scheduled_at: "2026-06-29T16:00:00Z", venue: "NRG Stadium", city: "Houston", label: "1º Grupo C vs 2º Grupo F" },
  { external_id: 77, home: "TBD", away: "TBD", phase: "r32", scheduled_at: "2026-06-30T21:00:00Z", venue: "MetLife Stadium", city: "New York", label: "1º Grupo I vs 3º C/D/F/G/H" },
  { external_id: 78, home: "TBD", away: "TBD", phase: "r32", scheduled_at: "2026-06-30T16:00:00Z", venue: "AT&T Stadium", city: "Dallas", label: "2º Grupo E vs 2º Grupo I" },
  { external_id: 79, home: "TBD", away: "TBD", phase: "r32", scheduled_at: "2026-07-01T01:00:00Z", venue: "Estadio Azteca", city: "Ciudad de México", label: "1º Grupo A vs 3º C/E/F/H/I" },
  { external_id: 80, home: "TBD", away: "TBD", phase: "r32", scheduled_at: "2026-07-01T16:00:00Z", venue: "Mercedes-Benz Stadium", city: "Atlanta", label: "1º Grupo L vs 3º E/H/I/J/K" },
  { external_id: 81, home: "TBD", away: "TBD", phase: "r32", scheduled_at: "2026-07-02T00:00:00Z", venue: "Levi's Stadium", city: "San Francisco", label: "1º Grupo D vs 3º B/E/F/I/J" },
  { external_id: 82, home: "TBD", away: "TBD", phase: "r32", scheduled_at: "2026-07-01T20:00:00Z", venue: "Lumen Field", city: "Seattle", label: "1º Grupo G vs 3º A/E/H/I/J" },
  { external_id: 83, home: "TBD", away: "TBD", phase: "r32", scheduled_at: "2026-07-02T23:00:00Z", venue: "BMO Field", city: "Toronto", label: "2º Grupo K vs 2º Grupo L" },
  { external_id: 84, home: "TBD", away: "TBD", phase: "r32", scheduled_at: "2026-07-02T19:00:00Z", venue: "SoFi Stadium", city: "Los Angeles", label: "1º Grupo H vs 2º Grupo J" },
  { external_id: 85, home: "TBD", away: "TBD", phase: "r32", scheduled_at: "2026-07-03T03:00:00Z", venue: "BC Place", city: "Vancouver", label: "1º Grupo B vs 3º E/F/G/I/J" },
  { external_id: 86, home: "TBD", away: "TBD", phase: "r32", scheduled_at: "2026-07-03T22:00:00Z", venue: "Hard Rock Stadium", city: "Miami", label: "1º Grupo J vs 2º Grupo H" },
  { external_id: 87, home: "TBD", away: "TBD", phase: "r32", scheduled_at: "2026-07-04T01:30:00Z", venue: "Arrowhead Stadium", city: "Kansas City", label: "1º Grupo K vs 3º D/E/I/J/L" },
  { external_id: 88, home: "TBD", away: "TBD", phase: "r32", scheduled_at: "2026-07-03T17:00:00Z", venue: "AT&T Stadium", city: "Dallas", label: "2º Grupo D vs 2º Grupo G" },

  { external_id: 89, home: "TBD", away: "TBD", phase: "r16", scheduled_at: "2026-07-04T21:00:00Z", venue: "Lincoln Financial Field", city: "Filadelfia", label: "Ganador 74 vs Ganador 77" },
  { external_id: 90, home: "TBD", away: "TBD", phase: "r16", scheduled_at: "2026-07-04T16:00:00Z", venue: "NRG Stadium", city: "Houston", label: "Ganador 73 vs Ganador 75" },
  { external_id: 91, home: "TBD", away: "TBD", phase: "r16", scheduled_at: "2026-07-05T20:00:00Z", venue: "MetLife Stadium", city: "New York", label: "Ganador 76 vs Ganador 78" },
  { external_id: 92, home: "TBD", away: "TBD", phase: "r16", scheduled_at: "2026-07-06T00:00:00Z", venue: "Estadio Azteca", city: "Ciudad de México", label: "Ganador 79 vs Ganador 80" },
  { external_id: 93, home: "TBD", away: "TBD", phase: "r16", scheduled_at: "2026-07-06T19:00:00Z", venue: "AT&T Stadium", city: "Dallas", label: "Ganador 83 vs Ganador 84" },
  { external_id: 94, home: "TBD", away: "TBD", phase: "r16", scheduled_at: "2026-07-07T00:00:00Z", venue: "Lumen Field", city: "Seattle", label: "Ganador 81 vs Ganador 82" },
  { external_id: 95, home: "TBD", away: "TBD", phase: "r16", scheduled_at: "2026-07-07T16:00:00Z", venue: "Mercedes-Benz Stadium", city: "Atlanta", label: "Ganador 86 vs Ganador 88" },
  { external_id: 96, home: "TBD", away: "TBD", phase: "r16", scheduled_at: "2026-07-07T20:00:00Z", venue: "BC Place", city: "Vancouver", label: "Ganador 85 vs Ganador 87" },

  { external_id: 97, home: "TBD", away: "TBD", phase: "qf", scheduled_at: "2026-07-09T20:00:00Z", venue: "Gillette Stadium", city: "Boston", label: "Ganador 89 vs Ganador 90" },
  { external_id: 98, home: "TBD", away: "TBD", phase: "qf", scheduled_at: "2026-07-10T19:00:00Z", venue: "SoFi Stadium", city: "Los Angeles", label: "Ganador 93 vs Ganador 94" },
  { external_id: 99, home: "TBD", away: "TBD", phase: "qf", scheduled_at: "2026-07-11T21:00:00Z", venue: "Hard Rock Stadium", city: "Miami", label: "Ganador 91 vs Ganador 92" },
  { external_id: 100, home: "TBD", away: "TBD", phase: "qf", scheduled_at: "2026-07-12T01:00:00Z", venue: "Arrowhead Stadium", city: "Kansas City", label: "Ganador 95 vs Ganador 96" },

  { external_id: 101, home: "TBD", away: "TBD", phase: "sf", scheduled_at: "2026-07-14T18:00:00Z", venue: "AT&T Stadium", city: "Dallas", label: "Ganador 97 vs Ganador 98" },
  { external_id: 102, home: "TBD", away: "TBD", phase: "sf", scheduled_at: "2026-07-15T19:00:00Z", venue: "Mercedes-Benz Stadium", city: "Atlanta", label: "Ganador 99 vs Ganador 100" },

  { external_id: 103, home: "TBD", away: "TBD", phase: "sf", scheduled_at: "2026-07-18T21:00:00Z", venue: "Hard Rock Stadium", city: "Miami", label: "Tercer puesto" },
  { external_id: 104, home: "TBD", away: "TBD", phase: "final", scheduled_at: "2026-07-19T19:00:00Z", venue: "MetLife Stadium", city: "New York", label: "Final" },
];

export const KNOCKOUT_LABELS: Record<number, string> = Object.fromEntries(
  MATCHES.filter((m) => m.label).map((m) => [m.external_id, m.label!])
);
