import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";
import { activeTab, openTabMenu, seedSortableGroups } from "../../__util__";

test("6. 그룹 목록을 한글 우선 한국어 문자순으로 정렬한다", async ({ page }) => {
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await seedSortableGroups(page);
    await openTabMenu(activeTab(page), viewport);
    await page.getByRole("menuitem", { name: "Move Group", exact: true }).click();
    await expect(page.locator(".move-group-option")).toHaveText([
      "가방", "나무", "다람쥐", "Alpha", "Zulu",
    ]);
  }
});
