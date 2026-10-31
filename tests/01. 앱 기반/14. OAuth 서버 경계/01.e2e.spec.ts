import { expect, test } from "@playwright/test";

import { oauthStart } from "../../__util__";

test("1. OAuth 시작은 카카오 인증 호스트로만 리다이렉트한다", async ({
  request,
}) => {
  // Given: 인증되지 않은 사용자가 카카오 로그인을 시작한다.
  // When: OAuth 시작 엔드포인트의 리다이렉트를 받는다.
  // Then: 카카오 인증 호스트의 authorize 경로만 사용한다.
  const response = await oauthStart(request);
  const location = new URL(response.headers().location);

  expect(response.status()).toBe(307);
  expect(location.protocol).toBe("https:");
  expect(location.hostname).toBe("kauth.kakao.com");
  expect(location.pathname).toBe("/oauth/authorize");
  expect(location.username).toBe("");
  expect(location.password).toBe("");
});
