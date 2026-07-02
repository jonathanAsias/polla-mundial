export type Winner = "home" | "away" | "draw";
export type WinnerSide = "home" | "away";

export function getWinner(home: number, away: number): Winner {
  if (home > away) return "home";
  if (away > home) return "away";
  return "draw";
}

/**
 * Ganador real del partido. Con penales/alargue el marcador puede ser empate
 * pero winnerSide indica quién avanzó (API-Football teams.*.winner).
 */
export function resolveActualWinner(
  actualHome: number,
  actualAway: number,
  winnerSide?: WinnerSide | null
): Winner {
  if (winnerSide === "home") return "home";
  if (winnerSide === "away") return "away";
  return getWinner(actualHome, actualAway);
}

/** Ganador correcto: 1 pt. Marcador exacto (90'+prórroga): 2 pts. Si ambos: 3 pts. */
export function calculateMatchPoints(
  predictedHome: number,
  predictedAway: number,
  actualHome: number,
  actualAway: number,
  winnerSide?: WinnerSide | null
): number {
  let points = 0;
  const predictedWinner = getWinner(predictedHome, predictedAway);
  const actualWinner = resolveActualWinner(
    actualHome,
    actualAway,
    winnerSide
  );
  const exactScore =
    predictedHome === actualHome && predictedAway === actualAway;

  if (exactScore) {
    points += 2;
  }

  if (predictedWinner === actualWinner) {
    points += 1;
  }

  return points;
}
