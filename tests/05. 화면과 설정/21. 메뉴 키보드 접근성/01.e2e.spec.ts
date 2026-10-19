import { expect, test } from "@playwright/test";

test("1. PC 헤더에는 카카오 로그인 버튼을 표시한다", async ({ page }) => {
  await page.goto("/");
  await page.setViewportSize({ width: 1280, height: 800 });
  await expect(page.locator(".header").getByRole("link", { name: "Continue with Kakao" })).toBeVisible();
});
