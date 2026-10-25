import { NextResponse } from "next/server";

import { groupShareVersion, readGroupShareToken } from "../../auth/_lib/session";
import { currentGroupUser, isSameOrigin, readGroupPayload } from "../_lib/request";
import { joinSharedGroup } from "../_lib/shared-store";

export async function POST(request: Request) {
  const user = await currentGroupUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  const payload = await readGroupPayload(request);
  const token = payload && typeof payload === "object" ? (payload as { token?: unknown }).token : null;
  const id = typeof token === "string" ? readGroupShareToken(token) : null;
  if (!id) return NextResponse.json({ error: "Invalid share link" }, { status: 400 });
  try {
    const group = await joinSharedGroup(user, id, groupShareVersion(token as string));
    if (!group) return NextResponse.json({ error: "Group unavailable" }, { status: 404 });
    return NextResponse.json({ group });
  } catch {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}
