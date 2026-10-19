import { expect, test } from "@playwright/test";

test("2. 모바일 헤더에도 카카오 로그인 버튼을 표시한다", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.locator(".header").getByRole("link", { name: "Continue with Kakao" })).toBeVisible();
});
