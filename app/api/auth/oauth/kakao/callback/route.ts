import { NextRequest, NextResponse } from "next/server";

import { exchangeKakaoCode, getKakaoUser } from "../../../_lib/kakao";
import {
  createSession,
  KAKAO_STATE_COOKIE,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
} from "../../../_lib/session";

function redirectWithError(request: NextRequest, error: string) {
  const response = NextResponse.redirect(
    new URL(`/?auth_error=${error}`, request.url),
  );
  response.cookies.delete(KAKAO_STATE_COOKIE);
  return response;
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const expectedState = request.cookies.get(KAKAO_STATE_COOKIE)?.value;

  if (!code || !state || !expectedState || state !== expectedState) {
    return redirectWithError(request, "invalid_state");
  }

  try {
    const accessToken = await exchangeKakaoCode(code);
    const user = await getKakaoUser(accessToken);
    const response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.delete(KAKAO_STATE_COOKIE);
    response.cookies.set(SESSION_COOKIE, createSession(user), {
      httpOnly: true,
      sameSite: "lax",
      secure: request.nextUrl.protocol === "https:",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    });
    return response;
  } catch {
    return redirectWithError(request, "oauth_failed");
  }
}
