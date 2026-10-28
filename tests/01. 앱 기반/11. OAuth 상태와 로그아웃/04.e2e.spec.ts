import { expect, test } from "@playwright/test";

import { OAUTH_COOKIE, SESSION_COOKIE } from "../../__fixture__";
import { getApi } from "../../__util__/request";

test("4. 쿠키와 다른 상태값의 콜백은 인증을 거부하고 상태 쿠키를 지운다", async ({
  request,
}) => {
  const response = await getApi(
    request,
    "/api/auth/oauth/kakao/callback?code=unused&state=wrong",
    { maxRedirects: 0, headers: { Cookie: OAUTH_COOKIE + "=expected" } },
  );
  expect(
    new URL(response.headers().location).searchParams.get("auth_error"),
  ).toBe("invalid_state");
  expect(response.headers()["set-cookie"]).toMatch(
    /web-notepad-kakao-state=;.*Expires=Thu, 01 Jan 1970/i,
  );
  expect(response.headers()["set-cookie"]).not.toContain(SESSION_COOKIE + "=");
});
