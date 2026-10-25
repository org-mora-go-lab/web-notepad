import "server-only";

import { type Client,createClient } from "@libsql/client";

let client: Client | undefined;
let schemaReady: Promise<void> | undefined;

function getClient() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url || (!url.startsWith("file:") && !authToken)) {
    throw new Error("Turso database credentials are not configured.");
  }
  return (client ??= createClient({ url, authToken }));
}

async function ensureSchema() {
  const database = getClient();
  schemaReady ??= database
    .execute(`CREATE TABLE IF NOT EXISTS notepad_update_history (
      event_id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      snapshot TEXT NOT NULL,
      created_at INTEGER NOT NULL
    )`)
    .then(() => undefined)
    .catch((error: unknown) => {
      schemaReady = undefined;
      throw error;
    });
  await schemaReady;
  return database;
}

export async function saveNotepadUpdate(userId: string, eventId: string, snapshot: string) {
  const database = await ensureSchema();
  await database.execute({
    sql: `INSERT OR IGNORE INTO notepad_update_history
      (event_id, user_id, snapshot, created_at) VALUES (?, ?, ?, ?)`,
    args: [eventId, userId, snapshot, Date.now()],
  });
}

export async function getLatestNotepadUpdate(userId: string) {
  const database = await ensureSchema();
  const result = await database.execute({
    sql: `SELECT event_id, snapshot, created_at FROM notepad_update_history
      WHERE user_id = ? ORDER BY created_at DESC, rowid DESC LIMIT 1`,
    args: [userId],
  });
  const row = result.rows[0];
  return row
    ? {
        eventId: String(row.event_id),
        snapshot: String(row.snapshot),
        createdAt: Number(row.created_at),
      }
    : null;
}

export async function countNotepadUpdates(userId: string) {
  const database = await ensureSchema();
  const result = await database.execute({
    sql: "SELECT COUNT(*) AS total FROM notepad_update_history WHERE user_id = ?",
    args: [userId],
  });
  return Number(result.rows[0]?.total ?? 0);
}
