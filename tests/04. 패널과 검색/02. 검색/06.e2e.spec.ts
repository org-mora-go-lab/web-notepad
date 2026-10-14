import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";
import { seedStoredStateOnLoad } from "../../__util__";
import { createGlobalSearchState } from "./__fixture__";

test("6. MENU의 SEARCH 항목은 PC와 모바일 모두 다른 MENU 항목과 같이 아이콘 오른쪽에 라벨을 표시한다", async ({ page }) => {
  await seedStoredStateOnLoad(page, createGlobalSearchState());
  const menu = page.getByRole("button", { name: "MENU", exact: true });
  const command = page.locator(".additional-tools-search");
  const closed = page.locator(".additional-tools-menu .closed-command");
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await menu.click();
    await expect(command).toContainText("SEARCH");
    const iconBounds = (await command.locator("svg").boundingBox())!;
    const labelBounds = (await command.locator("span").boundingBox())!;
    expect(iconBounds.x + iconBounds.width).toBeLessThanOrEqual(labelBounds.x);
    expect(iconBounds.y + iconBounds.height / 2).toBeCloseTo(labelBounds.y + labelBounds.height / 2, 0);
    // Same row layout as CLOSED above it.
    const closedIcon = (await closed.locator("svg").first().boundingBox())!;
    expect(iconBounds.x).toBeCloseTo(closedIcon.x, 0);
    await page.keyboard.press("Escape");
  }
});
