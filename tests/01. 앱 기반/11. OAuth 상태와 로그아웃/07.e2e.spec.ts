import { expect, test } from "@playwright/test";

import { getApi } from "../../__util__/request";

test("7. 로그인은 닉네임과 프로필 사진의 추가 동의를 요청한다", async ({
  request,
}) => {
  const response = await getApi(request, "/api/auth/oauth/kakao", {
    maxRedirects: 0,
  });
  expect(response.status()).toBe(307);
  const target = new URL(response.headers().location);
  expect(target.origin).toBe("https://kauth.kakao.com");
  expect(target.searchParams.get("scope")).toBe(
    "profile_nickname,profile_image",
  );
});
