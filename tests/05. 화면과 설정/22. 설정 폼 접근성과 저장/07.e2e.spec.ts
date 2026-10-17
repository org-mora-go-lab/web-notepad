import { expect, test } from "@playwright/test";

test("7. 글자 크기 변경을 새로고침 후 복원한다", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "MENU", exact: true }).click();
  await page.getByRole("menuitem", { name: "SETTINGS" }).click();
  await page.getByRole("radiogroup", { name: "Font Size" }).getByRole("radio", { name: "130%" }).check();
  await page.reload();
  await expect(page.locator(".home")).toHaveCSS("--font-scale", "1.3");
});
