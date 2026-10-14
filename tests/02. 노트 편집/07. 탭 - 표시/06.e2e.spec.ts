import { expect, test } from "@playwright/test";

test("6. PC 탭은 최대 너비 300.655px로 표시한다", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".tab-item").first()).toHaveCSS("max-width", "300.655px");
});
