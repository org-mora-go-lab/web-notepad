import { expect, test } from "@playwright/test";

test("9. Escape로 검색 팝업을 닫으면 펼침 상태를 false로 되돌린다", async ({ page }) => {
  await page.goto("/");
  await page.locator(".additional-tools-trigger").click();
  const search = page.locator(".global-search-command");
  await search.click();
  await page.keyboard.press("Escape");
  await expect(search).toHaveAttribute("aria-expanded", "false");
});
