import { expect, test } from "@playwright/test";

import { oauthStart } from "../../__util__";

test("4. OAuth state는 32바이트 기반의 URL 안전 난수다", async ({
  request,
}) => {
  // Given: 새 OAuth 인증 흐름을 시작한다.
  // When: 리다이렉트 URL의 state 값을 확인한다.
  // Then: 추측하기 어려운 URL-safe 43자 상태값을 발급한다.
  const response = await oauthStart(request);
  const location = new URL(response.headers().location);
  const state = location.searchParams.get("state");

  expect(response.status()).toBe(307);
  expect(state).not.toBeNull();
  expect(state).toHaveLength(43);
  expect(state).toMatch(/^[\w-]{43}$/);
  expect(state).not.toContain("=");
});
