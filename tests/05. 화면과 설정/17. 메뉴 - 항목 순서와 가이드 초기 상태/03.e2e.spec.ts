import { expect, test } from "@playwright/test";

test("3. 사용 가이드 팝업은 처음 열면 1 / 10 진행 상태를 표시한다", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "MENU", exact: true }).click();
  await page.getByRole("menuitem", { name: "GUIDE" }).click();

  await expect(page.getByRole("dialog").locator(".user-guide-progress")).toHaveText("1 / 10");
});
