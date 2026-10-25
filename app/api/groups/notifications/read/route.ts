import { NextResponse } from "next/server";

import { currentGroupUser, isSameOrigin } from "../../_lib/request";
import { markSharedNotificationsRead } from "../../_lib/shared-store";

export async function POST(request: Request) {
  const user = await currentGroupUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  try {
    await markSharedNotificationsRead(user.id);
    return NextResponse.json({ read: true });
  } catch {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}
