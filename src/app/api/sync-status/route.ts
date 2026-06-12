import { NextResponse } from "next/server";
import { getResultsSyncStatus } from "@/lib/sync-meta";

export async function GET() {
  try {
    const status = await getResultsSyncStatus();
    return NextResponse.json(status);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error" },
      { status: 500 }
    );
  }
}
