import { expect, test } from "@playwright/test";

test("5. ArrowDown은 다음 메뉴 항목으로 포커스를 이동한다", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "MENU", exact: true }).click();
  await page.keyboard.press("ArrowDown");
  await expect(page.getByRole("menuitem", { name: "SHORTCUT", exact: true })).toBeFocused();
});
