import { expect, test } from "@playwright/test";

test("6. 검색 버튼을 Enter로 실행하면 검색 팝업을 연다", async ({ page }) => {
  await page.goto("/");
  await page.locator(".additional-tools-trigger").click();
  await page.locator(".global-search-command").press("Enter");
  await expect(page.locator("#global-search-popup")).toBeVisible();
});
