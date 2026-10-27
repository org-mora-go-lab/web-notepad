import { NextResponse } from "next/server";

import type { BoardPost, SharedGroupData } from "@/src/4-entity/notepad";

import { createGroupShareToken } from "../auth/_lib/session";
import { sharedDatabase } from "../groups/_lib/database";
import { currentGroupUser } from "../groups/_lib/request";

export async function GET(request: Request) {
  try {
    const user = await currentGroupUser();
    const database = await sharedDatabase();
    const result = await database.execute({
      sql: `SELECT g.id, g.owner_id, viewer.user_id AS viewer_id, g.snapshot, g.updated_at, COALESCE(a.token_version, 0) AS token_version,
      (SELECT COUNT(*) FROM shared_group_members m WHERE m.group_id = g.id) AS member_count
      FROM shared_groups g LEFT JOIN shared_group_access a ON a.group_id = g.id
      LEFT JOIN shared_group_members viewer ON viewer.group_id = g.id AND viewer.user_id = ?
      WHERE COALESCE(a.enabled, 1) = 1 ORDER BY g.updated_at DESC, g.id`,
      args: [user?.id ?? ""],
    });
    const posts: BoardPost[] = result.rows.map((row) => {
      const group = JSON.parse(String(row.snapshot)) as SharedGroupData;
      const url = new URL("/", request.url);
      url.searchParams.set(
        "share",
        createGroupShareToken(String(row.id), Number(row.token_version)),
      );
      return {
        id: String(row.id),
        viewerRole: row.viewer_id
          ? String(row.owner_id) === user?.id
            ? "owner"
            : "member"
          : null,
        groupName: group.name,
        title: group.name,
        description: "",
        noteCount: group.tabs.length,
        memberCount: Number(row.member_count),
        updatedAt: Number(row.updated_at),
        inviteUrl: url.toString(),
      };
    });
    return NextResponse.json(
      { posts },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { error: "Database unavailable" },
      { status: 503 },
    );
  }
}
