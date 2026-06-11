import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isPredictionLocked } from "@/lib/predictions";
import { upsertPrediction } from "@/lib/supabase/predictions-db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const matchId = Number(searchParams.get("matchId"));

  if (!matchId || Number.isNaN(matchId)) {
    return NextResponse.json({ error: "matchId requerido" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("predictions")
    .select("*")
    .eq("user_id", user.id)
    .eq("match_id", matchId)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ prediction: data });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const body = await request.json();
  const matchId = Number(body.matchId);
  const predictedHome = Number(body.predictedHome);
  const predictedAway = Number(body.predictedAway);

  if (!matchId || Number.isNaN(matchId)) {
    return NextResponse.json({ error: "matchId inválido" }, { status: 400 });
  }

  if (
    Number.isNaN(predictedHome) ||
    Number.isNaN(predictedAway) ||
    predictedHome < 0 ||
    predictedHome > 20 ||
    predictedAway < 0 ||
    predictedAway > 20
  ) {
    return NextResponse.json(
      { error: "Marcadores deben ser entre 0 y 20" },
      { status: 400 }
    );
  }

  const { data: match, error: matchError } = await supabase
    .from("matches")
    .select("id, scheduled_at, status")
    .eq("id", matchId)
    .single<{ id: number; scheduled_at: string; status: string }>();

  if (matchError || !match) {
    return NextResponse.json({ error: "Partido no encontrado" }, { status: 404 });
  }

  if (isPredictionLocked(match.scheduled_at, match.status)) {
    return NextResponse.json(
      { error: "Las predicciones están cerradas para este partido" },
      { status: 403 }
    );
  }

  const { data: prediction, error } = await upsertPrediction(supabase, {
    user_id: user.id,
    match_id: matchId,
    predicted_home: predictedHome,
    predicted_away: predictedAway,
    submitted_at: new Date().toISOString(),
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ prediction });
}
