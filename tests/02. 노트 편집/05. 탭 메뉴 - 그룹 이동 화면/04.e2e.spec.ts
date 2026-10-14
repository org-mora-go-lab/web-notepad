import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";
import { moveGroupSourceTab, openTabMenu, seedMoveGroupState } from "../../__util__";

test("4. Escape는 이동 없이 그룹 목록과 탭 메뉴를 닫는다", async ({ page }) => {
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await seedMoveGroupState(page);
    await openTabMenu(moveGroupSourceTab(page), viewport);
    await page.getByRole("menuitem", { name: "Move Group", exact: true }).click();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("menu")).toHaveCount(0);
    await expect(moveGroupSourceTab(page)).toBeVisible();
  }
});
