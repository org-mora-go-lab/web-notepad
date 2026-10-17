import { expect, test } from "@playwright/test";

test("9. Tab으로 메뉴를 벗어나면 메뉴를 닫는다", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "MENU", exact: true }).click();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("menu", { name: "MENU", exact: true })).toBeHidden();
});
