import { expect, test } from "@playwright/test";

test("4. 검색 버튼은 dialog 팝업임을 알린다", async ({ page }) => {
  await page.goto("/");
  await page.locator(".additional-tools-trigger").click();
  await expect(page.locator(".global-search-command")).toHaveAttribute("aria-haspopup", "dialog");
});
