import { expect, test } from "@playwright/test";

import { signedSession } from "../../__fixture__";
import { authenticateBrowser, getApi } from "../../__util__";

test("6. 닉네임이 빈 서명 세션을 거부한다", async ({ page, context }) => {
  // Given: 닉네임이 빈 값인 서명 세션을 만든다.
  // When: 해당 쿠키로 세션을 조회한다.
  // Then: 프로필 필수 필드가 없으면 익명 상태를 유지한다.
  await authenticateBrowser(
    context,
    signedSession({
      id: "valid-id",
      nickname: "",
      expiresAt: Date.now() + 300_000,
    }),
  );
  const response = await getApi(page.request, "/api/auth/session");

  expect(response.status()).toBe(200);
  expect(await response.json()).toEqual({ user: null });
});
