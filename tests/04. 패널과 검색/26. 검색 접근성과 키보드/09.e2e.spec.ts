import { expect, test } from "@playwright/test";

test("9. 검색 팝업의 외부 영역을 누르면 팝업을 닫는다", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "SEARCH", exact: true }).click();
  const popup = page.locator("#global-search-popup");
  await page.mouse.click(4, 4);
  await expect(popup).not.toHaveAttribute("open", "");
});
