import { expect, test } from "@playwright/test";

test("4. 설정 패널은 Settings 이름의 complementary 랜드마크다", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "MENU", exact: true }).click();
  await page.getByRole("menuitem", { name: "SETTINGS" }).click();
  await expect(page.getByRole("complementary", { name: "Settings" })).toBeVisible();
});
