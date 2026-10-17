import { expect, test } from "@playwright/test";

test("5. 단축키 패널은 Shortcut 이름의 complementary 랜드마크다", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "MENU", exact: true }).click();
  await page.getByRole("menuitem", { name: "SHORTCUT" }).click();
  await expect(page.getByRole("complementary", { name: /Shortcut/ })).toBeVisible();
});
