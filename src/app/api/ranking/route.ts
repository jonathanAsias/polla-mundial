import { NextResponse } from "next/server";
import { getRanking } from "@/lib/queries/ranking";

export async function GET() {
  try {
    const ranking = await getRanking(100);
    return NextResponse.json({ ranking });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error" },
      { status: 500 }
    );
  }
}
