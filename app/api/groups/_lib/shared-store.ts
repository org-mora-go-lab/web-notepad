import "server-only";

import type { KakaoUser } from "@/app/api/auth/_lib/kakao";
import type { GroupEntry, SharedGroupData } from "@/src/4-entity/notepad";
import { applySharedGroupData, namespaceGroup, toSharedGroupData } from "@/src/4-entity/notepad";

import { sharedDatabase } from "./database";
import { describeGroupUpdate } from "./summary";

export type SharedRecord = {
  id: string;
  ownerId: string;
  revision: number;
  data: SharedGroupData;
  updatedAt: number;
};

function fromRow(row: Record<string, unknown>): SharedRecord {
  return {
    id: String(row.id),
    ownerId: String(row.owner_id),
    revision: Number(row.revision),
    data: JSON.parse(String(row.snapshot)) as SharedGroupData,
    updatedAt: Number(row.updated_at),
  };
}

export async function createOrGetSharedGroup(user: KakaoUser, group: GroupEntry) {
  const database = await sharedDatabase();
  const existing = await database.execute({
    sql: `SELECT * FROM shared_groups WHERE (owner_id = ? AND owner_local_id = ?) OR id = ? LIMIT 1`,
    args: [user.id, group.id, group.id],
  });
  const row = existing.rows[0];
  if (row) {
    const record = fromRow(row);
    const member = await database.execute({
      sql: "SELECT 1 FROM shared_group_members WHERE group_id = ? AND user_id = ?",
      args: [record.id, user.id],
    });
    if (!member.rows.length) return null;
    return { record, group: applySharedGroupData(group.id === record.id ? group : namespaceGroup(group, record.id.slice(7)), record.data) };
  }

  const id = `shared-${crypto.randomUUID()}`;
  const namespaced = namespaceGroup(group, id.slice(7));
  const data = toSharedGroupData(namespaced);
  const now = Date.now();
  await database.batch([
    {
      sql: "INSERT INTO shared_groups (id, owner_id, owner_local_id, snapshot, revision, updated_at) VALUES (?, ?, ?, ?, 0, ?)",
      args: [id, user.id, group.id, JSON.stringify(data), now],
    },
    {
      sql: "INSERT INTO shared_group_members (group_id, user_id, display_name, joined_at) VALUES (?, ?, ?, ?)",
      args: [id, user.id, user.nickname, now],
    },
  ], "write");
  return { record: { id, ownerId: user.id, revision: 0, data, updatedAt: now }, group: namespaced };
}

export async function joinSharedGroup(user: KakaoUser, id: string) {
  const database = await sharedDatabase();
  const found = await database.execute({ sql: "SELECT * FROM shared_groups WHERE id = ?", args: [id] });
  if (!found.rows[0]) return null;
  const lastEvent = await database.execute({
    sql: "SELECT COALESCE(MAX(id), 0) AS id FROM shared_group_events WHERE group_id = ?",
    args: [id],
  });
  await database.execute({
    sql: `INSERT OR IGNORE INTO shared_group_members
      (group_id, user_id, display_name, last_seen_event_id, joined_at) VALUES (?, ?, ?, ?, ?)`,
    args: [id, user.id, user.nickname, Number(lastEvent.rows[0]?.id ?? 0), Date.now()],
  });
  return fromRow(found.rows[0]);
}

export async function listSharedGroups(userId: string) {
  const database = await sharedDatabase();
  const result = await database.execute({
    sql: `SELECT g.* FROM shared_groups g JOIN shared_group_members m ON m.group_id = g.id
      WHERE m.user_id = ? ORDER BY g.updated_at DESC`,
    args: [userId],
  });
  return result.rows.map(fromRow);
}

export async function saveSharedGroup(
  user: KakaoUser,
  id: string,
  baseRevision: number,
  data: SharedGroupData,
) {
  const database = await sharedDatabase();
  const transaction = await database.transaction("write");
  try {
    const membership = await transaction.execute({
      sql: "SELECT 1 FROM shared_group_members WHERE group_id = ? AND user_id = ?",
      args: [id, user.id],
    });
    if (!membership.rows.length) return { kind: "forbidden" as const };
    const result = await transaction.execute({ sql: "SELECT * FROM shared_groups WHERE id = ?", args: [id] });
    const row = result.rows[0];
    if (!row) return { kind: "missing" as const };
    const current = fromRow(row);
    if (current.revision !== baseRevision) return { kind: "conflict" as const, record: current };
    if (JSON.stringify(current.data) === JSON.stringify(data)) return { kind: "saved" as const, record: current };
    const revision = current.revision + 1;
    const now = Date.now();
    await transaction.execute({
      sql: "UPDATE shared_groups SET snapshot = ?, revision = ?, updated_at = ? WHERE id = ?",
      args: [JSON.stringify(data), revision, now, id],
    });
    await transaction.execute({
      sql: `INSERT INTO shared_group_events (group_id, revision, actor_id, actor_name, summary, created_at)
        VALUES (?, ?, ?, ?, ?, ?)`,
      args: [id, revision, user.id, user.nickname, describeGroupUpdate(current.data, data), now],
    });
    await transaction.commit();
    return { kind: "saved" as const, record: { ...current, revision, data, updatedAt: now } };
  } finally {
    transaction.close();
  }
}

export async function listSharedNotifications(userId: string) {
  const database = await sharedDatabase();
  const result = await database.execute({
    sql: `SELECT e.id, e.group_id, e.actor_name, e.summary, e.created_at,
      g.snapshot, m.last_seen_event_id
      FROM shared_group_events e
      JOIN shared_group_members m ON m.group_id = e.group_id AND m.user_id = ?
      JOIN shared_groups g ON g.id = e.group_id
      WHERE e.actor_id <> ? ORDER BY e.id DESC LIMIT 30`,
    args: [userId, userId],
  });
  return result.rows.map((row) => ({
    id: Number(row.id),
    groupId: String(row.group_id),
    groupName: (JSON.parse(String(row.snapshot)) as SharedGroupData).name,
    actorName: String(row.actor_name),
    summary: String(row.summary),
    createdAt: Number(row.created_at),
    unread: Number(row.id) > Number(row.last_seen_event_id),
  }));
}

export async function markSharedNotificationsRead(userId: string) {
  const database = await sharedDatabase();
  await database.execute({
    sql: `UPDATE shared_group_members SET last_seen_event_id = COALESCE(
      (SELECT MAX(id) FROM shared_group_events WHERE group_id = shared_group_members.group_id), 0
    ) WHERE user_id = ?`,
    args: [userId],
  });
}
