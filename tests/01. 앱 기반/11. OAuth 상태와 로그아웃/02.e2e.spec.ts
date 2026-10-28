import { expect, test } from "@playwright/test";

import { OAUTH_COOKIE } from "../../__fixture__";
import { getApi } from "../../__util__/request";

test("2. OAuth 상태 쿠키는 짧은 수명과 스크립트 접근 차단을 적용한다", async ({
  request,
}) => {
  const response = await getApi(request, "/api/auth/oauth/kakao", {
    maxRedirects: 0,
  });
  const cookie = response.headers()["set-cookie"];
  expect(cookie).toContain(OAUTH_COOKIE + "=");
  expect(cookie).toMatch(/HttpOnly/i);
  expect(cookie).toMatch(/SameSite=lax/i);
  expect(cookie).toMatch(/Max-Age=600/i);
  expect(cookie).toMatch(/Path=\//);
});
