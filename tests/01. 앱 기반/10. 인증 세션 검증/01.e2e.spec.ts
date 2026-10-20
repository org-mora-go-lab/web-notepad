import { expect, test } from "@playwright/test";

test("1. 세션 쿠키가 없으면 익명 사용자를 반환한다", async ({ request }) => {
  const response = await request.get("/api/auth/session");
  expect(response.ok()).toBe(true);
  expect(await response.json()).toEqual({ user: null });
});
