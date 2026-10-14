import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";

test("1. MENU 드롭다운은 PC와 모바일에서 지정된 항목 순서로 표시한다", async ({ page }) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "MENU", exact: true });

  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await trigger.click();
    const menu = page.getByRole("menu", { name: "MENU", exact: true });
    const labels = await menu.locator('[role="menuitem"]:visible').evaluateAll((items) =>
      items.map((item) =>
        item.textContent?.match(/THEME|CLOSED|SETTINGS|SHORTCUT|SEARCH|GUIDE/)?.[0],
      ),
    );
    expect(labels).toEqual(
      viewport.width <= 640
        ? ["THEME", "SETTINGS", "GUIDE", "CLOSED", "SEARCH"]
        : ["THEME", "SHORTCUT", "SETTINGS", "GUIDE", "CLOSED", "SEARCH"],
    );
    await page.keyboard.press("Escape");
  }
});
