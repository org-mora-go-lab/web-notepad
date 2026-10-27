import { NextRequest, NextResponse } from "next/server";

import { exchangeKakaoCode, getKakaoUser } from "../../../_lib/kakao";
import {
  createSession,
  KAKAO_STATE_COOKIE,
  readGroupShareToken,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  SHARE_RETURN_COOKIE,
} from "../../../_lib/session";

function redirectWithError(request: NextRequest, error: string) {
  const target = new URL("/", request.url);
  target.searchParams.set("auth_error", error);
  const share = request.cookies.get(SHARE_RETURN_COOKIE)?.value;
  if (share && readGroupShareToken(share))
    target.searchParams.set("share", share);
  const response = NextResponse.redirect(target);
  response.cookies.delete(KAKAO_STATE_COOKIE);
  response.cookies.delete(SHARE_RETURN_COOKIE);
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
    const target = new URL("/", request.url);
    const share = request.cookies.get(SHARE_RETURN_COOKIE)?.value;
    if (share && readGroupShareToken(share))
      target.searchParams.set("share", share);
    const response = NextResponse.redirect(target);
    response.cookies.delete(KAKAO_STATE_COOKIE);
    response.cookies.delete(SHARE_RETURN_COOKIE);
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
