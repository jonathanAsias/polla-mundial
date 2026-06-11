"use client";

import { useState } from "react";
import type { MatchWithTeams } from "@/lib/queries/matches";
import type { Prediction } from "@/types/database";
import {
  getPredictionDeadline,
  isPredictionLocked,
} from "@/lib/predictions";
import { CountdownTimer } from "@/components/match/countdown-timer";
import { PredictionForm } from "@/components/match/prediction-form";
import { ScoreboardDigit } from "@/components/match/scoreboard-digit";

interface MatchCardProps {
  match: MatchWithTeams;
  prediction?: Prediction;
}

export function MatchCard({ match, prediction: initialPrediction }: MatchCardProps) {
  const [prediction, setPrediction] = useState(initialPrediction);
  const locked = isPredictionLocked(match.scheduled_at, match.status);
  const deadline = getPredictionDeadline(match.scheduled_at);
  const isFinished = match.status === "finished";
  const isLive = match.status === "live";

  const matchTime = new Date(match.scheduled_at).toLocaleString("es", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

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

  return (
    <article className="overflow-hidden rounded-xl border border-dorado-copa/20 bg-[#1a1a1a] shadow-lg">
      <div className="flex items-center justify-between border-b border-dorado-copa/10 px-4 py-2">
        <span className="font-mono text-xs text-blanco-linea/40">
          {match.phase === "group" ? "Fase de grupos" : match.phase.toUpperCase()}
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

      <div className="px-4 py-6">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div className="text-center">
            <span className="text-3xl">{match.home_team.flag_emoji}</span>
            <p className="mt-2 font-display text-lg leading-tight text-blanco-linea">
              {match.home_team.name}
            </p>
          </div>

          <div className="flex items-center gap-1 rounded-lg bg-negro-noche px-4 py-3">
            <ScoreboardDigit value={homeDisplay} />
            <span className="font-display text-3xl text-dorado-copa/50">:</span>
            <ScoreboardDigit value={awayDisplay} />
          </div>

          <div className="text-center">
            <span className="text-3xl">{match.away_team.flag_emoji}</span>
            <p className="mt-2 font-display text-lg leading-tight text-blanco-linea">
              {match.away_team.name}
            </p>
          </div>
        </div>

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

      {!isFinished && match.home_team.code !== "TBD" && (
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
