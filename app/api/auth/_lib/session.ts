import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

import type { KakaoUser } from "./kakao";

export const KAKAO_STATE_COOKIE = "web-notepad-kakao-state";
export const SESSION_COOKIE = "web-notepad-session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

type SessionPayload = KakaoUser & {
  expiresAt: number;
};

function getSessionSecret() {
  const secret = process.env.AUTH_SECRET ?? process.env.KAKAO_REST_API_KEY;
  if (!secret) throw new Error("AUTH_SECRET is not configured.");
  return secret;
}

function sign(value: string) {
  return createHmac("sha256", getSessionSecret()).update(value).digest("base64url");
}

export function createOAuthState() {
  return randomBytes(32).toString("base64url");
}

export function createSession(user: KakaoUser) {
  const payload: SessionPayload = {
    ...user,
    expiresAt: Date.now() + SESSION_MAX_AGE * 1000,
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encoded}.${sign(encoded)}`;
}

export function readSession(value?: string): KakaoUser | null {
  if (!value) return null;
  const [encoded, signature] = value.split(".");
  if (!encoded || !signature) return null;

  const expected = Buffer.from(sign(encoded));
  const received = Buffer.from(signature);
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf8"),
    ) as SessionPayload;
    if (payload.expiresAt <= Date.now() || !payload.id || !payload.nickname) return null;
    return {
      id: payload.id,
      nickname: payload.nickname,
      profileImageUrl: payload.profileImageUrl,
    };
  } catch {
    return null;
  }
}
