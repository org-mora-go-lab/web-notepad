import { expect, test } from "@playwright/test";

test("2. 모바일 헤더에도 MENU 버튼을 표시한다", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.locator(".header").getByRole("button", { name: "MENU", exact: true })).toBeVisible();
});
