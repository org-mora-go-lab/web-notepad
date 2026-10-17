import { expect, test } from "@playwright/test";

test("3. 헤더 검색 버튼은 검색 팝업을 제어한다", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".global-search-command")).toHaveAttribute("aria-controls", "global-search-popup");
});
