import { expect, test } from "@playwright/test";

import { authenticate, getApi } from "../../__util__";

test("2. 세션 응답은 private no-store 캐시 정책을 적용한다", async ({
  page,
  context,
}) => {
  // Given: 유효한 서명 세션을 브라우저에 저장한다.
  // When: 인증된 세션 API를 조회한다.
  // Then: 개인 응답을 브라우저와 공유 캐시에 남기지 않는다.
  await authenticate(context);
  const response = await getApi(page.request, "/api/auth/session");
  const payload = await response.json();

  expect(response.status()).toBe(200);
  expect(response.headers()["cache-control"]).toBe("private, no-store");
  expect(payload.user).toBeTruthy();
  expect(payload.user.nickname).toBe("Server Tester");
});
