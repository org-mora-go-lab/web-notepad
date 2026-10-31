import { expect, test } from "@playwright/test";

import { authenticate, getApi } from "../../__util__";

test("8. 로그아웃은 성공 JSON을 반환하고 세션을 무효화한다", async ({
  page,
  context,
}) => {
  // Given: 유효한 사용자 세션이 존재한다.
  // When: 로그아웃 API를 호출한다.
  // Then: 성공을 반환하고 후속 세션 조회를 익명으로 바꾼다.
  await authenticate(context);
  const logout = await page.request.post("/api/auth/logout");
  const session = await getApi(page.request, "/api/auth/session");

  expect(logout.status()).toBe(200);
  expect(await logout.json()).toEqual({ ok: true });
  expect(session.status()).toBe(200);
  expect(await session.json()).toEqual({ user: null });
});
