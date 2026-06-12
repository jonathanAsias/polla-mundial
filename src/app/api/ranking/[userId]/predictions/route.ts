import { NextResponse } from "next/server";
import { getUserPredictionsForRanking } from "@/lib/queries/ranking";

export async function GET(
  _request: Request,
  { params }: { params: { userId: string } }
) {
  const userId = params.userId;

  if (!userId) {
    return NextResponse.json({ error: "userId requerido" }, { status: 400 });
  }

  try {
    const predictions = await getUserPredictionsForRanking(userId);
    return NextResponse.json({ predictions });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error" },
      { status: 500 }
    );
  }
}
