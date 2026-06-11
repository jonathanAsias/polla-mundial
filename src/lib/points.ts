type Winner = "home" | "away" | "draw";

export function getWinner(home: number, away: number): Winner {
  if (home > away) return "home";
  if (away > home) return "away";
  return "draw";
}

export function calculateMatchPoints(
  predictedHome: number,
  predictedAway: number,
  actualHome: number,
  actualAway: number
): number {
  let points = 0;
  const predictedWinner = getWinner(predictedHome, predictedAway);
  const actualWinner = getWinner(actualHome, actualAway);

  if (predictedWinner === actualWinner) {
    points += 1;
  }

  if (predictedHome === actualHome && predictedAway === actualAway) {
    points += 1;
  }

  return points;
}
