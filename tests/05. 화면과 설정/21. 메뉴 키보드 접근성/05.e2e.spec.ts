import { expect, test } from "@playwright/test";

test("5. 검색 버튼은 키보드 Tab 순서에 포함한다", async ({ page }) => {
  await page.goto("/");
  await page.locator(".additional-tools-trigger").click();
  const search = page.locator(".global-search-command");
  await search.focus();
  await expect(search).toBeFocused();
});
