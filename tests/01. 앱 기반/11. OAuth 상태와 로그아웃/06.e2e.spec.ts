import { expect, test } from "@playwright/test";

import { OAUTH_COOKIE, SESSION_COOKIE } from "../../__fixture__";
import { sessionHeaders } from "../../__util__";

test("6. 로그아웃은 세션과 진행 중인 OAuth 상태를 모두 만료시킨다", async ({
  request,
}) => {
  await request.get("/api/auth/oauth/kakao", { maxRedirects: 0 });
  const response = await request.post("/api/auth/logout", {
    headers: sessionHeaders(),
  });
  expect(await response.json()).toEqual({ ok: true });
  const cookies = response
    .headersArray()
    .filter((header) => header.name.toLowerCase() === "set-cookie");
  for (const name of [SESSION_COOKIE, OAUTH_COOKIE])
    expect(
      cookies.some(
        ({ value }) => value.startsWith(name + "=;") && /Max-Age=0/.test(value),
      ),
    ).toBe(true);
  expect(await (await request.get("/api/auth/session")).json()).toEqual({
    user: null,
  });
});
