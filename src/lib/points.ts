type Winner = "home" | "away" | "draw";

export function getWinner(home: number, away: number): Winner {
  if (home > away) return "home";
  if (away > home) return "away";
  return "draw";
}

/** Ganador correcto: 1 pt. Marcador exacto: 2 pts. Si ambos: 3 pts total. */
export function calculateMatchPoints(
  predictedHome: number,
  predictedAway: number,
  actualHome: number,
  actualAway: number
): number {
  let points = 0;
  const predictedWinner = getWinner(predictedHome, predictedAway);
  const actualWinner = getWinner(actualHome, actualAway);
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
