import { expect, test } from "@playwright/test";

test("3. 메뉴를 열면 첫 번째 THEME 항목에 포커스를 둔다", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "MENU", exact: true }).click();
  await expect(page.getByRole("menuitem", { name: "THEME", exact: true })).toBeFocused();
});
