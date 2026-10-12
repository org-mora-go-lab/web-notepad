import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../__constant__";

test("4. PC와 모바일 MENU 드롭다운 항목은 아이콘 18px·글자 15px로 표시한다", async ({ page }) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "MENU", exact: true });
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await trigger.click();
    const menu = page.getByRole("menu", { name: "MENU", exact: true });
    await expect(page.getByRole("menuitem", { name: "THEME" })).toBeVisible();
    const items = await menu.locator('[role="menuitem"]:visible').all();
    expect(items.length).toBeGreaterThan(0);
    for (const item of items) {
      await expect(item).toHaveCSS("font-size", "15px");
      await expect(item.locator("svg").first()).toHaveCSS("width", "18px");
    }
    await page.keyboard.press("Escape");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  }
});
