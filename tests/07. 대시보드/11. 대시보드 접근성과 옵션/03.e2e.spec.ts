import { expect, test } from "@playwright/test";

test("3. 열린 대시보드 옵션은 Dashboard options 이름의 dialog다", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "DASHBOARD" }).click();
  await page.getByRole("button", { name: "Dashboard options" }).click();
  await expect(page.getByRole("dialog", { name: "Dashboard options" })).toBeVisible();
});
