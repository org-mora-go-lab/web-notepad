import { expect, test } from "@playwright/test";

test("5. Option+F12는 Dashboard를 열고 닫는다", async ({ page }) => {
  await page.goto("/");
  const dashboard = page.locator("#dashboard-panel");
  const editor = page.locator("textarea");

  await editor.press("Alt+F12");
  await expect(dashboard).toHaveAttribute("aria-hidden", "false");
  await page.keyboard.press("Alt+F12");
  await expect(dashboard).toHaveAttribute("aria-hidden", "true");
});
