import { expect, test } from "@playwright/test";

import { oauthStart } from "../../__util__";

test("6. OAuth state 쿠키는 HttpOnly SameSite Lax와 10분 수명을 적용한다", async ({
  request,
}) => {
  // Given: OAuth 시작 요청이 상태 쿠키를 발급한다.
  // When: Set-Cookie 보안 속성을 검사한다.
  // Then: 스크립트 접근 차단·Lax 정책·10분 만료를 적용한다.
  const response = await oauthStart(request);
  const cookie = response.headers()["set-cookie"];
  const normalized = cookie.toLowerCase();

  expect(response.status()).toBe(307);
  expect(normalized).toContain("web-notepad-kakao-state=");
  expect(normalized).toContain("httponly");
  expect(normalized).toContain("samesite=lax");
  expect(normalized).toContain("max-age=600");
});
