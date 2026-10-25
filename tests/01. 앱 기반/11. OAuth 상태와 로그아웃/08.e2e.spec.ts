import { expect, test } from "@playwright/test";

import { signedSession } from "../../__fixture__";
import { authenticateBrowser } from "../../__util__";
import { withKakaoProfile } from "./__mock__";

test("8. 카카오에서 받은 계정 프로필을 로그인 이름과 사진으로 표시한다", async ({ page, context }) => {
  const { user, requests } = await withKakaoProfile({
    id: 12345,
    kakao_account: { profile: { nickname: " 실제 사용자 ", profile_image_url: "https://example.test/kakao.svg" } },
    properties: { nickname: "이전 이름", profile_image: "https://example.test/old.svg" },
  });
  expect(requests).toEqual([
    "https://kapi.kakao.com/v2/user/me",
    "https://kapi.kakao.com/v1/api/talk/profile",
  ]);
  await page.route("https://example.test/kakao.svg", route => route.fulfill({
    contentType: "image/svg+xml",
    body: '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12"/>',
  }));
  await authenticateBrowser(context, signedSession({ ...user, expiresAt: Date.now() + 60000 }));
  await page.goto("/");
  const login = page.getByRole("button", { name: /^실제 사용자 ·/ });
  await expect(login).toBeVisible();
  await expect(login.locator("img")).toHaveAttribute("src", "https://example.test/kakao.svg");
  await expect.poll(() => login.locator("img").evaluate((image: HTMLImageElement) => image.naturalWidth)).toBe(12);
});
