import { expect, test } from "@playwright/test";

test("8. 검색을 선택하면 더보기를 닫고 검색 팝업을 연다", async ({ page }) => {
  await page.goto("/");
  await page.locator(".more-command").click();
  const search = page.locator(".global-search-command");
  await search.click();
  await expect(page.locator("#global-search-popup")).toBeVisible();
  await expect(page.locator(".more-command")).toHaveAttribute("aria-expanded", "false");
});
