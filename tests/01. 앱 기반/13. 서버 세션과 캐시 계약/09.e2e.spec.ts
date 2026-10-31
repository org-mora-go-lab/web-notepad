import { expect, test } from "@playwright/test";

import { authenticate } from "../../__util__";

test("9. 로그아웃 세션 쿠키는 HttpOnly SameSite Lax와 즉시 만료를 사용한다", async ({
  page,
  context,
}) => {
  // Given: 로그인 세션 쿠키가 브라우저에 설정되어 있다.
  // When: 로그아웃 응답의 Set-Cookie를 확인한다.
  // Then: HttpOnly·SameSite=Lax와 즉시 만료를 모두 적용한다.
  await authenticate(context);
  const response = await page.request.post("/api/auth/logout");
  const cookie = response.headers()["set-cookie"];
  const normalized = cookie.toLowerCase();

  expect(response.status()).toBe(200);
  expect(cookie).toContain("web-notepad-session=");
  expect(normalized).toContain("httponly");
  expect(normalized).toContain("samesite=lax");
  expect(cookie).toContain("Max-Age=0");
});
