import { expect, test } from "@playwright/test";

test("3. 대시보드 패널은 Dashboard 이름의 complementary 랜드마크다", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "DASHBOARD" }).click();
  await expect(page.getByRole("complementary", { name: "Dashboard" })).toBeVisible();
});
