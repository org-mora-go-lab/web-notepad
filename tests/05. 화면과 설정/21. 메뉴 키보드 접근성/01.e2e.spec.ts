import { expect, test } from "@playwright/test";

test("1. 검색 버튼은 dialog 팝업임을 알린다", async ({ page }) => {
  await page.goto("/");
  await page.locator(".group-select-command").click();
  await page.locator(".more-command").click();
  await expect(page.locator(".global-search-command")).toHaveAttribute(
    "aria-haspopup",
    "dialog",
  );
});
