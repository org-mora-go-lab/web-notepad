import { NextResponse } from "next/server";

import { getKakaoConfig } from "../../_lib/kakao";
import {
  createOAuthState,
  KAKAO_STATE_COOKIE,
  readGroupShareToken,
  SHARE_RETURN_COOKIE,
} from "../../_lib/session";

export async function GET(request: Request) {
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
