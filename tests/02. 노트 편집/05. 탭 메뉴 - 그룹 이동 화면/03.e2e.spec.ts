import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";
import { moveGroupSourceTab, openTabMenu, seedMoveGroupState } from "../../__util__";

test("3. 그룹 목록의 뒤로가기 버튼은 이동 없이 기존 탭 메뉴로 돌아간다", async ({ page }) => {
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await seedMoveGroupState(page);
    await openTabMenu(moveGroupSourceTab(page), viewport);
    await page.getByRole("menuitem", { name: "Move Group", exact: true }).click();
    await page.getByRole("menuitem", { name: "Back to tab actions" }).click();
    await expect(page.getByRole("menu", { name: "Tab actions", exact: true })).toBeVisible();
    await expect(page.getByRole("menuitem", { name: "Unpin", exact: true })).toBeVisible();
    await expect(moveGroupSourceTab(page)).toBeVisible();
  }
});
