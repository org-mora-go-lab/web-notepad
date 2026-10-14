import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";
import { moveGroupSourceTab, openTabMenu, seedMoveGroupState } from "../../__util__";

test("8. 그룹 항목에는 아이콘을 숨기고 상단 뒤로가기 화살표만 표시한다", async ({ page }) => {
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await seedMoveGroupState(page);
    await openTabMenu(moveGroupSourceTab(page), viewport);
    await page.getByRole("menuitem", { name: "Move Group", exact: true }).click();
    const menu = page.getByRole("menu", { name: "Move Group", exact: true });
    await expect(menu.locator(".move-group-option svg")).toHaveCount(0);
    await expect(menu.getByRole("menuitem", { name: "Back to tab actions" }).locator("svg")).toHaveCount(1);
  }
});
