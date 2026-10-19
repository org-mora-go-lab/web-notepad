import { expect, test } from "@playwright/test";

test("9. Escape로 검색 팝업을 닫으면 더보기로 포커스를 되돌린다", async ({ page }) => {
  await page.goto("/");
  await page.locator(".more-command").click();
  const search = page.locator(".global-search-command");
  await search.click();
  await page.keyboard.press("Escape");
  await expect(page.locator("#global-search-popup")).not.toBeVisible();
  await expect(page.locator(".more-command")).toBeFocused();
});
