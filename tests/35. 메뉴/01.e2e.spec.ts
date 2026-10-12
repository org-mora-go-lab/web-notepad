import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../__constant__";

test("1. MENU는 탭 줄 우측 상단에 탭 목록과 겹치지 않게 배치하고 THEME·CLOSED·SETTINGS·SHORTCUT 순서로 표시한다", async ({ page }) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "MENU", exact: true });
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await expect(trigger).toBeInViewport();
    const bounds = (await trigger.boundingBox())!;
    expect(bounds.y).toBe(0);
    expect(bounds.x + bounds.width).toBeCloseTo(viewport.width, 1);
    const tabsBounds = (await page.locator(".tabs-scroll").first().boundingBox())!;
    expect(tabsBounds.x + tabsBounds.width).toBeLessThanOrEqual(bounds.x + 1);
    await expect(trigger.locator("svg")).toBeVisible();
    await expect(trigger.locator("svg")).toHaveClass(/lucide-menu/);
    await trigger.click();
    const menu = page.getByRole("menu", { name: "MENU", exact: true });
    await expect(page.getByRole("menuitem", { name: "THEME" })).toBeVisible();
    await expect(page.getByRole("menuitem", { name: "닫은 탭" })).toBeVisible();
    await expect(page.getByRole("menuitem", { name: "설정" })).toBeVisible();
    if (viewport.width <= 640) await expect(page.getByRole("menuitem", { name: "SHORTCUT" })).toBeHidden();
    else await expect(page.getByRole("menuitem", { name: "SHORTCUT" })).toBeVisible();
    const labels = await menu.locator('[role="menuitem"]:visible').evaluateAll(items =>
      items.map(item => item.textContent?.match(/THEME|CLOSED|SETTINGS|SHORTCUT/)?.[0]));
    expect(labels).toEqual(viewport.width <= 640
      ? ["THEME", "CLOSED", "SETTINGS"]
      : ["THEME", "CLOSED", "SETTINGS", "SHORTCUT"]);
    await page.keyboard.press("Escape");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  }
});
