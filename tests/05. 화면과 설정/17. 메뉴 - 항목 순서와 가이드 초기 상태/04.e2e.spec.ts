import { expect, test } from "@playwright/test";

test("4. 사용 가이드 팝업은 처음 열면 Previous 버튼을 비활성화한다", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "MENU", exact: true }).click();
  await page.getByRole("menuitem", { name: "GUIDE" }).click();

  await expect(page.getByRole("dialog").getByRole("button", { name: "Previous" })).toBeDisabled();
});
