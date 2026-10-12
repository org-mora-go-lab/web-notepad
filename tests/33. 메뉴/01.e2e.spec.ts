import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../__constant__";

test("1. MENU는 우측 상단에 배치하며 모바일은 아이콘만 표시한다", async ({ page }) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "MENU", exact: true });
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await expect(trigger).toBeInViewport();
    const bounds = (await trigger.boundingBox())!;
    expect(bounds.y).toBe(0);
    expect(bounds.width).toBe(viewport.width <= 640 ? 45 : 112);
    expect(bounds.x + bounds.width).toBeCloseTo(viewport.width, 1);
    await expect(trigger.locator("svg")).toBeVisible();
    await expect(trigger.locator("svg")).toHaveClass(/lucide-menu/);
    await expect(trigger.locator("svg")).toHaveCSS("width", viewport.width <= 640 ? "22px" : "18px");
    if (viewport.width > 640) await expect(trigger).toHaveCSS("font-size", "15px");
    if (viewport.width <= 640) await expect(trigger.locator("span")).toBeHidden();
    else await expect(trigger.locator("span")).toHaveText("MENU");
    await trigger.click();
    const menu = page.getByRole("menu", { name: "MENU", exact: true });
    await expect(menu).toHaveCSS("width", viewport.width <= 640 ? "200px" : "208px");
    await expect(menu).toHaveCSS("border-radius", viewport.width <= 640 ? "4px" : "6px");
    await expect(page.getByRole("menuitem", { name: "THEME" })).toBeVisible();
    for (const item of await menu.locator('[role="menuitem"]:visible').all()) {
      await expect(item).toHaveCSS("font-size", "15px");
      await expect(item.locator("svg").first()).toHaveCSS("width", "18px");
    }
    await expect(page.getByRole("menuitem", { name: "닫은 탭" })).toBeVisible();
    if (viewport.width <= 640) await expect(page.getByRole("menuitem", { name: "SHORTCUT" })).toBeHidden();
    else await expect(page.getByRole("menuitem", { name: "SHORTCUT" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  }
});