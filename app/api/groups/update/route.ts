import { NextResponse } from "next/server";

import type { SharedGroupData } from "@/src/4-entity/notepad";

import {
  currentGroupUser,
  isSameOrigin,
  readGroupPayload,
} from "../_lib/request";
import { saveSharedGroup } from "../_lib/shared-store";

export async function POST(request: Request) {
  const user = await currentGroupUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isSameOrigin(request))
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  const payload = await readGroupPayload(request);
  const input =
    payload && typeof payload === "object"
      ? (payload as Record<string, unknown>)
      : {};
  const data = input.data as SharedGroupData | undefined;
  if (
    typeof input.id !== "string" ||
    !/^shared-[0-9a-f-]{36}$/i.test(input.id) ||
    !Number.isSafeInteger(input.baseRevision) ||
    Number(input.baseRevision) < 0 ||
    !data ||
    data.id !== input.id ||
    typeof data.name !== "string" ||
    data.name.length > 60 ||
    !Array.isArray(data.tabs) ||
    !Array.isArray(data.bookmarks) ||
    !data.tabs.every(
      (tab) =>
        tab && typeof tab.id === "string" && typeof tab.content === "string",
    )
  ) {
    return NextResponse.json({ error: "Invalid update" }, { status: 400 });
  }
  try {
    const result = await saveSharedGroup(
      user,
      input.id,
      Number(input.baseRevision),
      data,
    );
    if (result.kind === "forbidden")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    if (result.kind === "missing")
      return NextResponse.json({ error: "Group unavailable" }, { status: 404 });
    if (result.kind === "conflict")
      return NextResponse.json({ group: result.record }, { status: 409 });
    return NextResponse.json({ group: result.record });
  } catch {
    return NextResponse.json(
      { error: "Database unavailable" },
      { status: 503 },
    );
  }
}
