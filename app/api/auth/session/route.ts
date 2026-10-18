import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { readSession, SESSION_COOKIE } from "../_lib/session";

export async function GET() {
  const cookieStore = await cookies();
  const user = readSession(cookieStore.get(SESSION_COOKIE)?.value);
  return NextResponse.json(
    { user },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
