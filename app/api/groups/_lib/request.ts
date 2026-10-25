import { cookies } from "next/headers";

import { readSession, SESSION_COOKIE } from "../../auth/_lib/session";

export async function currentGroupUser() {
  const cookieStore = await cookies();
  return readSession(cookieStore.get(SESSION_COOKIE)?.value);
}

export function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  return !origin || origin === new URL(request.url).origin;
}

export async function readGroupPayload(request: Request) {
  const text = await request.text();
  if (text.length > 5_000_000) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}
