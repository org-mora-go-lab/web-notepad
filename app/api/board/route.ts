import { NextResponse } from "next/server";

import type { BoardPost, SharedGroupData } from "@/src/4-entity/notepad";

import {
  createGroupShareToken,
  readGroupShareToken,
} from "../auth/_lib/session";
import { sharedDatabase } from "../groups/_lib/database";
import { isSameOrigin, readGroupPayload } from "../groups/_lib/request";

const response = (body: unknown, status = 200) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function GET(request: Request) {
  try {
    const database = await sharedDatabase();
    const result = await database.execute(`SELECT b.*, g.snapshot,
      (SELECT COUNT(*) FROM shared_group_members m WHERE m.group_id = g.id) AS member_count
      FROM shared_group_board b JOIN shared_groups g ON g.id = b.group_id ORDER BY b.updated_at DESC, b.id`);
    const posts: BoardPost[] = result.rows.map((row) => {
      const group = JSON.parse(String(row.snapshot)) as SharedGroupData;
      const url = new URL("/", request.url);
      url.searchParams.set(
        "share",
        createGroupShareToken(String(row.group_id)),
      );
      return {
        id: String(row.id),
        groupName: group.name,
        title: String(row.title),
        description: String(row.description),
        noteCount: group.tabs.length,
        memberCount: Number(row.member_count),
        updatedAt: Number(row.updated_at),
        inviteUrl: url.toString(),
      };
    });
    return response({ posts });
  } catch {
    return response({ error: "Database unavailable" }, 503);
  }
}

// Temporary management mode requested by the product: this is not account-based admin authentication.
async function mutate(request: Request, method: "POST" | "PATCH" | "DELETE") {
  if (
    new URL(request.url).searchParams.get("role") !== "admin" ||
    !isSameOrigin(request)
  )
    return response({ error: "Forbidden" }, 403);
  const body = await readGroupPayload(request);
  if (!body || typeof body !== "object")
    return response({ error: "Invalid post" }, 400);
  const input = body as Record<string, unknown>;
  const id = typeof input.id === "string" ? input.id : "";
  if (method !== "POST" && !/^[0-9a-f-]{36}$/i.test(id))
    return response({ error: "Invalid post" }, 400);
  const title = typeof input.title === "string" ? input.title.trim() : "";
  const description =
    typeof input.description === "string" ? input.description.trim() : "";
  if (
    method !== "DELETE" &&
    (!title || title.length > 80 || !description || description.length > 1000)
  )
    return response({ error: "Invalid post" }, 400);
  let groupId: string | null = null;
  if (method === "POST") {
    try {
      const url = new URL(String(input.inviteUrl));
      if (!/^https?:$/.test(url.protocol))
        return response({ error: "Invalid invite" }, 400);
      groupId = readGroupShareToken(url.searchParams.get("share") ?? "");
    } catch {
      return response({ error: "Invalid invite" }, 400);
    }
    if (!groupId) return response({ error: "Invalid invite" }, 400);
  }
  try {
    const database = await sharedDatabase();
    if (method === "POST") {
      const group = await database.execute({
        sql: "SELECT id FROM shared_groups WHERE id = ?",
        args: [groupId!],
      });
      if (!group.rows.length)
        return response({ error: "Group unavailable" }, 404);
      const existing = await database.execute({
        sql: "SELECT id FROM shared_group_board WHERE group_id = ?",
        args: [groupId!],
      });
      if (existing.rows.length)
        return response({ error: "Already published" }, 409);
      await database.execute({
        sql: "INSERT INTO shared_group_board (id, group_id, title, description, updated_at) VALUES (?, ?, ?, ?, ?)",
        args: [crypto.randomUUID(), groupId!, title, description, Date.now()],
      });
    } else {
      const result = await database.execute(
        method === "PATCH"
          ? {
              sql: "UPDATE shared_group_board SET title = ?, description = ?, updated_at = ? WHERE id = ?",
              args: [title, description, Date.now(), id],
            }
          : { sql: "DELETE FROM shared_group_board WHERE id = ?", args: [id] },
      );
      if (!result.rowsAffected)
        return response({ error: "Post unavailable" }, 404);
    }
    return response({ ok: true }, method === "POST" ? 201 : 200);
  } catch (error) {
    if (String(error).includes("UNIQUE constraint"))
      return response({ error: "Already published" }, 409);
    return response({ error: "Database unavailable" }, 503);
  }
}

export const POST = (request: Request) => mutate(request, "POST");
export const PATCH = (request: Request) => mutate(request, "PATCH");
export const DELETE = (request: Request) => mutate(request, "DELETE");
