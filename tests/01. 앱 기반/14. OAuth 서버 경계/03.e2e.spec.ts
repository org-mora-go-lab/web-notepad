import { expect, test } from "@playwright/test";

import { oauthStart } from "../../__util__";

test("3. OAuth 인증 URL은 정확한 callback과 프로필 scope를 사용한다", async ({
  request,
}) => {
  // Given: 로컬 콜백과 최소 프로필 scope가 설정되어 있다.
  // When: 카카오 인증 URL을 만든다.
  // Then: 정확한 콜백과 닉네임·이미지 scope만 전달한다.
  const response = await oauthStart(request);
  const query = new URL(response.headers().location).searchParams;

  expect(response.status()).toBe(307);
  expect(query.get("redirect_uri")).toBe(
    "http://localhost:3000/api/auth/oauth/kakao/callback",
  );
  expect(query.get("scope")).toBe("profile_nickname,profile_image");
  expect(query.get("prompt")).toBeNull();
});
