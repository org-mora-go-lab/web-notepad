import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";
import { moveGroupSourceTab, openTabMenu, seedMoveGroupState } from "../../__util__";

test("9. 그룹 선택 화면과 기본 탭 메뉴의 너비는 201px다", async ({ page }) => {
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await seedMoveGroupState(page);
    await openTabMenu(moveGroupSourceTab(page), viewport);
    await expect(page.getByRole("menu", { name: "Tab actions", exact: true })).toHaveCSS("width", "201px");
    await page.getByRole("menuitem", { name: "Move Group", exact: true }).click();
    await expect(page.getByRole("menu", { name: "Move Group", exact: true })).toHaveCSS("width", "201px");
  }
});
