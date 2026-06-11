import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username")?.trim();

  if (!username || !USERNAME_REGEX.test(username)) {
    return NextResponse.json(
      { available: false, error: "invalid_username" },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", username)
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { available: false, error: "check_failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ available: !data });
}
