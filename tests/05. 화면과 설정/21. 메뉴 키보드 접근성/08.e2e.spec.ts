import { expect, test } from "@playwright/test";

test("8. 검색 팝업이 열리면 검색 버튼의 펼침 상태는 true다", async ({ page }) => {
  await page.goto("/");
  const search = page.locator(".global-search-command");
  await search.click();
  await expect(search).toHaveAttribute("aria-expanded", "true");
});
