import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { readSession, SESSION_COOKIE } from "../../auth/_lib/session";
import { countNotepadUpdates, getLatestNotepadUpdate, saveNotepadUpdate } from "../_lib/history";

async function currentUserId() {
  const cookieStore = await cookies();
  return readSession(cookieStore.get(SESSION_COOKIE)?.value)?.id;
}

export async function GET() {
  const userId = await currentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const [latest, count] = await Promise.all([
      getLatestNotepadUpdate(userId),
      countNotepadUpdates(userId),
    ]);
    return NextResponse.json({ latest, count }, { headers: { "Cache-Control": "private, no-store" } });
  } catch {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const userId = await currentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  }
  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!input || typeof input !== "object") {
    return NextResponse.json({ error: "Invalid update" }, { status: 400 });
  }
  const { eventId, snapshot } = input as Record<string, unknown>;
  if (
    typeof eventId !== "string" ||
    !/^[0-9a-f-]{36}$/i.test(eventId) ||
    typeof snapshot !== "string" ||
    snapshot.length > 5_000_000
  ) {
    return NextResponse.json({ error: "Invalid update" }, { status: 400 });
  }
  try {
    const state = JSON.parse(snapshot) as Record<string, unknown>;
    if (!Array.isArray(state.groups) || !Array.isArray(state.closedTabs) || !state.settings) {
      return NextResponse.json({ error: "Invalid snapshot" }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "Invalid snapshot" }, { status: 400 });
  }
  try {
    await saveNotepadUpdate(userId, eventId, snapshot);
    return NextResponse.json({ saved: true }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}
