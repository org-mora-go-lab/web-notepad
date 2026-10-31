import { expect, test } from "@playwright/test";

import { signedSession } from "../../__fixture__";
import { authenticateBrowser, getApi } from "../../__util__";

test("5. 사용자 ID가 빈 서명 세션을 거부한다", async ({ page, context }) => {
  // Given: 사용자 ID가 빈 값인 서명 세션을 만든다.
  // When: 해당 쿠키로 세션을 조회한다.
  // Then: 서명 여부와 무관하게 불완전한 사용자를 거부한다.
  await authenticateBrowser(
    context,
    signedSession({
      id: "",
      nickname: "Valid",
      expiresAt: Date.now() + 300_000,
    }),
  );
  const response = await getApi(page.request, "/api/auth/session");

  expect(response.status()).toBe(200);
  expect(await response.json()).toEqual({ user: null });
});
