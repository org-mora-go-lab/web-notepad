import { NextResponse } from "next/server";

import { getKakaoConfig } from "../../_lib/kakao";
import {
  createOAuthState,
  createSession,
  KAKAO_STATE_COOKIE,
  readGroupShareToken,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  SHARE_RETURN_COOKIE,
} from "../../_lib/session";

function isLocalDevelopmentLogin(request: Request) {
  const hostname = new URL(request.url).hostname;
  return (
    (hostname === "localhost" || hostname === "127.0.0.1") &&
    process.env.NODE_ENV !== "production" &&
    (process.env.NODE_ENV === "development" ||
      process.env.LOCAL_DEV_LOGIN === "1") &&
    process.env.LOCAL_DEV_LOGIN !== "0"
  );
}

export async function GET(request: Request) {
  if (isLocalDevelopmentLogin(request)) {
    const response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.set(
      SESSION_COOKIE,
      createSession({
        id: "local-test-user",
        nickname: "TEST",
        profileImageUrl: "/test-user.svg",
      }),
      {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        path: "/",
        maxAge: SESSION_MAX_AGE,
      },
    );
    response.cookies.delete(KAKAO_STATE_COOKIE);
    return response;
  }
  try {
    const { clientId, redirectUri } = getKakaoConfig();
    const state = createOAuthState();
    const authorizeUrl = new URL("https://kauth.kakao.com/oauth/authorize");
    authorizeUrl.search = new URLSearchParams({
      response_type: "code",
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: "profile_nickname,profile_image",
      state,
    }).toString();

    const response = NextResponse.redirect(authorizeUrl);
    const share = new URL(request.url).searchParams.get("share");
    if (share && readGroupShareToken(share)) {
      response.cookies.set(SHARE_RETURN_COOKIE, share, {
        httpOnly: true,
        sameSite: "lax",
        secure: new URL(request.url).protocol === "https:",
        path: "/",
        maxAge: 60 * 10,
      });
    } else {
      response.cookies.delete(SHARE_RETURN_COOKIE);
    }
    response.cookies.set(KAKAO_STATE_COOKIE, state, {
      httpOnly: true,
      sameSite: "lax",
      secure: new URL(request.url).protocol === "https:",
      path: "/",
      maxAge: 60 * 10,
    });
    return response;
  } catch {
    return NextResponse.redirect(
      new URL("/?auth_error=configuration", request.url),
    );
  }
}
