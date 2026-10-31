import { expect, test } from "@playwright/test";

import { oauthStart } from "../../__util__";

test("8. 외부 return 쿼리는 OAuth 리다이렉트 목적지를 바꾸지 못한다", async ({
  request,
}) => {
  // Given: 외부 사이트 URL을 return 쿼리에 삽입한다.
  // When: OAuth 시작 엔드포인트를 호출한다.
  // Then: 외부 return을 무시하고 카카오 인증 호스트만 사용한다.
  const response = await oauthStart(
    request,
    "?return=https%3A%2F%2Fevil.example",
  );
  const location = new URL(response.headers().location);

  expect(response.status()).toBe(307);
  expect(location.hostname).toBe("kauth.kakao.com");
  expect(location.href).not.toContain("evil.example");
  expect(location.protocol).toBe("https:");
});
