"use client";

import { useEffect, useState } from "react";
import type { MatchWithTeams } from "@/lib/queries/matches";
import type { Prediction } from "@/types/database";
import { getPredictionDeadline } from "@/lib/predictions";
import { usePredictionLock } from "@/hooks/use-prediction-lock";
import { CountdownTimer } from "@/components/match/countdown-timer";
import { PredictionForm } from "@/components/match/prediction-form";
import { ScoreboardDigit } from "@/components/match/scoreboard-digit";
import { TeamFlag } from "@/components/teams/team-flag";
import { PointsConfetti } from "@/components/match/points-confetti";
import { formatMatchDateTime } from "@/lib/match-datetime";
import {
  formatPhaseLabel,
  getMatchGroupLabel,
  getMatchTeams,
} from "@/lib/match-display";

interface MatchCardProps {
  match: MatchWithTeams;
  prediction?: Prediction;
}

export function MatchCard({ match, prediction: initialPrediction }: MatchCardProps) {
  const [prediction, setPrediction] = useState(initialPrediction);

  useEffect(() => {
    setPrediction(initialPrediction);
  }, [initialPrediction]);

  const locked = usePredictionLock(match.scheduled_at, match.status);
  const deadline = getPredictionDeadline(match.scheduled_at);
  const isFinished = match.status === "finished";
  const isLive = match.status === "live";
  const { home, away, isKnockoutPlaceholder } = getMatchTeams(match);
  const groupLabel = getMatchGroupLabel(match);
  const canPredict =
    !isFinished && !isKnockoutPlaceholder && match.home_team.code !== "TBD";

  const matchTime = formatMatchDateTime(match.scheduled_at);

  const showRealScore =
    isFinished &&
    match.home_score !== null &&
    match.away_score !== null;

  const showPredicted =
    prediction && !showRealScore;

  const homeDisplay = showRealScore
    ? match.home_score!
    : showPredicted
      ? prediction!.predicted_home
      : "-";

  const awayDisplay = showRealScore
    ? match.away_score!
    : showPredicted
      ? prediction!.predicted_away
      : "-";

  const showConfetti =
    isFinished && prediction !== undefined && prediction.points_earned > 0;

  return (
    <article className="overflow-hidden rounded-xl border border-dorado-copa/20 bg-[#1a1a1a] shadow-lg">
      <PointsConfetti
        points={prediction?.points_earned ?? 0}
        active={showConfetti}
      />
      <div className="flex flex-wrap items-center justify-between gap-1 border-b border-dorado-copa/10 px-3 py-2 sm:px-4">
        <span className="font-mono text-[10px] text-blanco-linea/40 sm:text-xs">
          {formatPhaseLabel(match.phase)}
          {groupLabel && ` · ${groupLabel}`}
          {match.external_id && ` · #${match.external_id}`}
        </span>
        <span className="text-xs">
          {isLive && (
            <span className="font-mono font-semibold text-rojo-tarjeta">
              EN VIVO
            </span>
          )}
          {isFinished && (
            <span className="font-mono text-verde-cancha">FINALIZADO</span>
          )}
          {!isLive && !isFinished && (
            <span className="text-blanco-linea/50">{matchTime}</span>
          )}
        </span>
      </div>

      <div className="px-3 py-5 sm:px-4 sm:py-6">
        {isKnockoutPlaceholder ? (
          <p className="text-center font-display text-lg text-blanco-linea sm:text-xl">
            {away ? `${home} vs ${away}` : home}
          </p>
        ) : (
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-3">
            <div className="flex flex-col items-center text-center">
              <TeamFlag code={match.home_team.code} size="md" />
              <p className="mt-2 font-display text-sm leading-tight text-blanco-linea sm:text-lg">
                {match.home_team.name}
              </p>
            </div>

            <div className="flex items-center gap-0.5 rounded-lg bg-negro-noche px-2 py-2 sm:gap-1 sm:px-4 sm:py-3">
              <ScoreboardDigit value={homeDisplay} />
              <span className="font-display text-2xl text-dorado-copa/50 sm:text-3xl">:</span>
              <ScoreboardDigit value={awayDisplay} />
            </div>

            <div className="flex flex-col items-center text-center">
              <TeamFlag code={match.away_team.code} size="md" />
              <p className="mt-2 font-display text-sm leading-tight text-blanco-linea sm:text-lg">
                {match.away_team.name}
              </p>
            </div>
          </div>
        )}

        {isFinished && (
          <div className="mt-4 text-center">
            {prediction ? (
              <p
                className={`font-mono text-sm ${
                  prediction.points_earned > 0
                    ? "font-semibold text-dorado-copa"
                    : "text-blanco-linea/50"
                }`}
              >
                {prediction.points_earned > 0
                  ? `+${prediction.points_earned} pts 🎉`
                  : "0 pts — sin aciertos"}
              </p>
            ) : (
              <p className="text-xs text-blanco-linea/40">
                No registraste predicción
              </p>
            )}
          </div>
        )}

        {showRealScore && prediction && (
          <p className="mt-1 text-center text-xs text-blanco-linea/40">
            Tu predicción: {prediction.predicted_home} - {prediction.predicted_away}
          </p>
        )}

        {(match.city || match.venue) && (
          <p className="mt-3 text-center text-xs text-blanco-linea/40">
            {[match.city, match.venue].filter(Boolean).join(" · ")}
          </p>
        )}
      </div>

      {canPredict && (
        <div className="space-y-3 border-t border-dorado-copa/10 bg-gris-estadio/40 px-4 py-4">
          {!locked && <CountdownTimer deadline={deadline} />}
          <PredictionForm
            matchId={match.id}
            homeTeam={match.home_team.name}
            awayTeam={match.away_team.name}
            prediction={prediction}
            isLocked={locked}
            onSaved={setPrediction}
          />
        </div>
      )}
    </article>
  );
}
