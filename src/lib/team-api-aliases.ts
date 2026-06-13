import { TEAMS } from "@/data/teams";

/** Nombres en inglés que usa API-Football → código FIFA en la app */
const API_OVERRIDES: Record<string, string> = {
  "South Korea": "KOR",
  "Korea Republic": "KOR",
  Mexico: "MEX",
  "South Africa": "RSA",
  Czechia: "CZE",
  "Czech Republic": "CZE",
  Canada: "CAN",
  "Bosnia & Herzegovina": "BIH",
  "Bosnia and Herzegovina": "BIH",
  Switzerland: "SUI",
  Qatar: "QAT",
  Brazil: "BRA",
  Morocco: "MAR",
  Haiti: "HAI",
  Scotland: "SCO",
  "United States": "USA",
  USA: "USA",
  Paraguay: "PAR",
  Australia: "AUS",
  Turkey: "TUR",
  Germany: "GER",
  Curacao: "CUW",
  "Cote D'Ivoire": "CIV",
  "Ivory Coast": "CIV",
  Ecuador: "ECU",
  Netherlands: "NED",
  Japan: "JPN",
  Tunisia: "TUN",
  Sweden: "SWE",
  Belgium: "BEL",
  Egypt: "EGY",
  Iran: "IRN",
  "Iran IR": "IRN",
  "New Zealand": "NZL",
  Spain: "ESP",
  "Cape Verde": "CPV",
  "Cape Verde Islands": "CPV",
  "Saudi Arabia": "KSA",
  Uruguay: "URU",
  France: "FRA",
  Senegal: "SEN",
  Norway: "NOR",
  Iraq: "IRQ",
  Argentina: "ARG",
  Algeria: "ALG",
  Austria: "AUT",
  Jordan: "JOR",
  Portugal: "POR",
  Uzbekistan: "UZB",
  Colombia: "COL",
  "DR Congo": "COD",
  Congo: "COD",
  England: "ENG",
  Croatia: "CRO",
  Ghana: "GHA",
  Panama: "PAN",
};

const nameToCode = new Map<string, string>();

for (const team of TEAMS) {
  if (team.code === "TBD") continue;
  nameToCode.set(normalizeTeamName(team.name), team.code);
}

for (const [apiName, code] of Object.entries(API_OVERRIDES)) {
  nameToCode.set(normalizeTeamName(apiName), code);
}

function normalizeTeamName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function apiTeamNameToCode(name: string): string | null {
  return nameToCode.get(normalizeTeamName(name)) ?? null;
}
