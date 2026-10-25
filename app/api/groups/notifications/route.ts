import { NextResponse } from "next/server";

import { currentGroupUser } from "../_lib/request";
import { listSharedNotifications } from "../_lib/shared-store";

export async function GET() {
  const user = await currentGroupUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    return NextResponse.json(
      { notifications: await listSharedNotifications(user.id) },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}
