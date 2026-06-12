import { NextResponse } from "next/server";
import { getMatchRemindersForUser } from "@/lib/queries/dashboard";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  try {
    const reminders = await getMatchRemindersForUser(user.id);
    const pending = reminders.filter((r) => !r.hasPrediction && !r.locked);

    return NextResponse.json({ reminders, pending });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error" },
      { status: 500 }
    );
  }
}
