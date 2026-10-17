import { expect, test } from "@playwright/test";

test("9. 로딩 완료 후 앱 루트에 로딩 표시를 남기지 않는다", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".home")).toBeVisible();
  await expect(page.locator(".home.is-loading")).toHaveCount(0);
});
