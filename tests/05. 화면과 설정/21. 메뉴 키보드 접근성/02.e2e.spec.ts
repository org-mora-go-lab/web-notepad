import { expect, test } from "@playwright/test";

test("2. 열린 메뉴는 MENU 이름의 menu 역할로 제공한다", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "MENU", exact: true }).click();
  await expect(page.getByRole("menu", { name: "MENU", exact: true })).toBeVisible();
});
