import { expect, test } from "@playwright/test";

test("8. 패널 슬라이드 변경을 새로고침 후 복원한다", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "MENU", exact: true }).click();
  await page.getByRole("menuitem", { name: "SETTINGS" }).click();
  await page.getByRole("radiogroup", { name: "Panel Slide" }).getByRole("radio", { name: "On", exact: true }).check();
  await page.reload();
  await expect(page.locator(".home")).toHaveAttribute("data-panel-slide", "on");
});
