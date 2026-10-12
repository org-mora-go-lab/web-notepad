import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../__constant__";

test("5. PC와 모바일 하단에는 CLOSED와 SHORTCUT을 표시하지 않는다", async ({ page }) => {
  await page.goto("/");
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await expect(page.locator('.footer [aria-controls="shortcuts-panel"], .footer [aria-controls="closed-panel"]')).toHaveCount(0);
    await page.getByRole("button", { name: "MENU", exact: true }).click();
    await expect(page.getByRole("menuitem", { name: "닫은 탭" })).toBeVisible();
    if (viewport.width <= 640) await expect(page.getByRole("menuitem", { name: "SHORTCUT" })).toBeHidden();
    else await expect(page.getByRole("menuitem", { name: "SHORTCUT" })).toBeVisible();
    await page.keyboard.press("Escape");
  }
});