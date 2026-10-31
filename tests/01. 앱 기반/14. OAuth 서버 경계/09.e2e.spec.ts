import { expect, test } from "@playwright/test";

import { getApi } from "../../__util__";

test("9. code 없는 callback은 로컬 invalid_state로 복귀한다", async ({
  request,
}) => {
  // Given: 상태 쿠키 없이 OAuth 콜백을 직접 호출한다.
  // When: 누락된 state로 콜백 응답을 받는다.
  // Then: 로컬 앱의 invalid_state 오류로만 복귀한다.
  const response = await getApi(
    request,
    "/api/auth/oauth/kakao/callback?state=missing",
    { maxRedirects: 0 },
  );
  const location = new URL(response.headers().location);

  expect(response.status()).toBe(307);
  expect(location.origin).toBe("http://localhost:3000");
  expect(location.searchParams.get("auth_error")).toBe("invalid_state");
  expect(location.hostname).not.toBe("kauth.kakao.com");
});
