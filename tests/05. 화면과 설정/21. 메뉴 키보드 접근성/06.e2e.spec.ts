import { expect, test } from "@playwright/test";

test("6. ArrowUp은 첫 항목에서 마지막 항목으로 순환한다", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "MENU", exact: true }).click();
  await page.keyboard.press("ArrowUp");
  await expect(page.getByRole("menuitem", { name: "Ungrouped", exact: true })).toBeFocused();
});
