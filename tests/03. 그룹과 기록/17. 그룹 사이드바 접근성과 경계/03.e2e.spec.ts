import { expect, test } from "@playwright/test";

test("3. 사이드바 닫기 버튼은 대상 이름을 제공한다", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Toggle sidebar" }).click();
  await expect(page.getByRole("button", { name: "Close Sidebar" })).toBeVisible();
});
