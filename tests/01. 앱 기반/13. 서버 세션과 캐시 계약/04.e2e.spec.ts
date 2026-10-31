import { expect, test } from "@playwright/test";

import { getApi, sessionToken } from "../../__util__";

test("4. 구분자가 과도한 세션 쿠키를 거부한다", async ({ page, context }) => {
  // Given: 정상 토큰 뒤에 불필요한 서명 구분자를 덧붙인다.
  // When: 변조된 쿠키로 세션을 조회한다.
  // Then: 서버는 오류를 노출하지 않고 익명으로 처리한다.
  await context.addCookies([
    {
      name: "web-notepad-session",
      value: `${sessionToken("extra-segment")}.extra`,
      url: "http://localhost:3000",
    },
  ]);
  const response = await getApi(page.request, "/api/auth/session");
  const payload = await response.json();

  expect(response.status()).toBe(200);
  expect(payload).toEqual({ user: null });
});
