import "server-only";

import { type Client, createClient } from "@libsql/client";

let client: Client | undefined;
let schemaReady: Promise<void> | undefined;

export async function sharedDatabase() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url || (!url.startsWith("file:") && !authToken)) {
    throw new Error("Turso database credentials are not configured.");
  }
  const database = (client ??= createClient({ url, authToken }));
  schemaReady ??= database.batch([
    `CREATE TABLE IF NOT EXISTS shared_groups (
      id TEXT PRIMARY KEY,
      owner_id TEXT NOT NULL,
      owner_local_id TEXT NOT NULL,
      snapshot TEXT NOT NULL,
      revision INTEGER NOT NULL DEFAULT 0,
      updated_at INTEGER NOT NULL,
      UNIQUE(owner_id, owner_local_id)
    )`,
    `CREATE TABLE IF NOT EXISTS shared_group_members (
      group_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      display_name TEXT NOT NULL,
      last_seen_event_id INTEGER NOT NULL DEFAULT 0,
      joined_at INTEGER NOT NULL,
      PRIMARY KEY(group_id, user_id)
    )`,
    `CREATE TABLE IF NOT EXISTS shared_group_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      group_id TEXT NOT NULL,
      revision INTEGER NOT NULL,
      actor_id TEXT NOT NULL,
      actor_name TEXT NOT NULL,
      summary TEXT NOT NULL,
      created_at INTEGER NOT NULL
    )`,
    "CREATE INDEX IF NOT EXISTS shared_group_events_group_id ON shared_group_events(group_id, id)",
    `CREATE TABLE IF NOT EXISTS shared_group_board (
      id TEXT PRIMARY KEY,
      group_id TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      updated_at INTEGER NOT NULL
    )`,
  ], "write").then(() => undefined).catch((error: unknown) => {
    schemaReady = undefined;
    throw error;
  });
  await schemaReady;
  return database;
}
