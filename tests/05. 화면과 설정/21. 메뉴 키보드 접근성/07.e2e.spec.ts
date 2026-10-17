import { expect, test } from "@playwright/test";

test("7. 검색 팝업이 닫혀 있으면 검색 버튼의 펼침 상태는 false다", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".global-search-command")).toHaveAttribute("aria-expanded", "false");
});
