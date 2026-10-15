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
        item.textContent?.match(/THEME|SETTINGS|SHORTCUT|GUIDE|All Group|Ungrouped/)?.[0],
      ),
    );
    expect(labels).toEqual(
      viewport.width <= 512
        ? ["THEME", "SETTINGS", "GUIDE", "All Group", "Ungrouped"]
        : ["THEME", "SHORTCUT", "SETTINGS", "GUIDE", "All Group", "Ungrouped"],
    );
    const divider = menu.getByRole("separator");
    await expect(divider).toHaveCount(1);
    const guideBox = (await menu.getByRole("menuitem", { name: "GUIDE", exact: true }).boundingBox())!;
    const dividerBox = (await divider.boundingBox())!;
    const allGroupBox = (await menu.getByRole("menuitem", { name: "All Group", exact: true }).boundingBox())!;
    expect(dividerBox.y).toBeGreaterThanOrEqual(guideBox.y + guideBox.height);
    expect(allGroupBox.y).toBeGreaterThanOrEqual(dividerBox.y + dividerBox.height);
    await page.keyboard.press("Escape");
  }
});
