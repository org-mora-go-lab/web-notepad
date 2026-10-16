import { expect, test } from "@playwright/test";

test("5. 사용자 가이드 팝업 바깥의 배경을 클릭하면 닫는다", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "MENU", exact: true }).click();
  await page.getByRole("menuitem", { name: "GUIDE" }).click();

  const guide = page.locator(".user-guide");
  await expect(guide).toBeVisible();
  await page.mouse.click(4, 4);
  await expect(guide).toHaveCount(0);
});
