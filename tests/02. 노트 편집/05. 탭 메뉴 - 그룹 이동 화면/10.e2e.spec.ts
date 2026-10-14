import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";
import { moveGroupSourceTab, openTabMenu, seedMoveGroupState } from "../../__util__";

test("10. 그룹 선택 화면과 기본 탭 메뉴 항목의 최소 높이는 39px다", async ({ page }) => {
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await seedMoveGroupState(page);
    await openTabMenu(moveGroupSourceTab(page), viewport);
    await expect(page.getByRole("menu", { name: "Tab actions", exact: true }).getByRole("menuitem").first()).toHaveCSS("min-height", "39px");
    await page.getByRole("menuitem", { name: "Move Group", exact: true }).click();
    await expect(page.getByRole("menu", { name: "Move Group", exact: true }).getByRole("menuitem").first()).toHaveCSS("min-height", "39px");
  }
});
