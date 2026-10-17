import { expect, test } from "@playwright/test";

test("1. Font Size 설정은 제목으로 이름이 지정된 radiogroup이다", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "MENU", exact: true }).click();
  await page.getByRole("menuitem", { name: "SETTINGS" }).click();
  await expect(page.getByRole("radiogroup", { name: "Font Size" })).toBeVisible();
});
