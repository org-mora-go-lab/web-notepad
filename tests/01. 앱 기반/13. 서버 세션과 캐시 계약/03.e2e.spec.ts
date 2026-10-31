import { expect, test } from "@playwright/test";

import { authenticate, getApi } from "../../__util__";

test("3. 유효한 세션은 만료 시각 없이 최소 프로필만 반환한다", async ({
  page,
  context,
}) => {
  // Given: 식별 가능한 유효 세션으로 인증한다.
  // When: 현재 사용자 프로필을 요청한다.
  // Then: ID와 닉네임만 노출하고 만료 정보는 숨긴다.
  await authenticate(context, "session-safe");
  const response = await getApi(page.request, "/api/auth/session");
  const payload = await response.json();

  expect(response.status()).toBe(200);
  expect(payload.user).toEqual({
    id: "session-safe",
    nickname: "Server Tester",
  });
  expect(payload.user).not.toHaveProperty("expiresAt");
  expect(payload.user).not.toHaveProperty("role");
});
