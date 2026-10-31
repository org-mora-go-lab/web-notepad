import { expect, test } from "@playwright/test";

import { getApi } from "../../__util__";

test("10. state 불일치 callback은 세션을 만들지 않고 임시 쿠키를 만료한다", async ({
  page,
  context,
}) => {
  // Given: 기대 state와 다른 콜백 및 공유 복귀 쿠키가 존재한다.
  // When: 가짜 code와 잘못된 state로 콜백을 호출한다.
  // Then: OAuth 상태를 만료시키고 로그인 세션을 생성하지 않는다.
  await context.addCookies([
    {
      name: "web-notepad-kakao-state",
      value: "expected",
      url: "http://localhost:3000",
    },
    {
      name: "web-notepad-share-return",
      value: "invalid.token",
      url: "http://localhost:3000",
    },
  ]);
  const response = await getApi(
    page.request,
    "/api/auth/oauth/kakao/callback?code=fake&state=wrong",
    { maxRedirects: 0 },
  );
  const session = await getApi(page.request, "/api/auth/session");

  expect(response.status()).toBe(307);
  expect(response.headers()["set-cookie"]).toContain(
    "web-notepad-kakao-state=",
  );
  expect(await session.json()).toEqual({ user: null });
});
