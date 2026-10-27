import { expect, test } from "@playwright/test";

test("2. 검색 버튼은 키보드 Tab 순서에 포함한다", async ({ page }) => {
  await page.goto("/");
  await page.locator(".more-command").click();
  const search = page.locator(".global-search-command");
  await page
    .locator("#footer-more-menu")
    .getByRole("button", { name: "GUIDE", exact: true })
    .focus();
  await page.keyboard.press("Tab");
  await expect(search).toBeFocused();
});
