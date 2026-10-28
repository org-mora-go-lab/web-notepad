import { expect, test } from "@playwright/test";

import { SESSION_COOKIE } from "../../__fixture__";
import { getApi } from "../../__util__/request";

test("5. 상태 쿠키 없이 직접 연 콜백은 세션을 만들지 않는다", async ({
  request,
}) => {
  const response = await getApi(
    request,
    "/api/auth/oauth/kakao/callback?code=unused&state=expected",
    { maxRedirects: 0 },
  );
  expect(
    new URL(response.headers().location).searchParams.get("auth_error"),
  ).toBe("invalid_state");
  expect(response.headers()["set-cookie"]).not.toContain(SESSION_COOKIE + "=");
});
