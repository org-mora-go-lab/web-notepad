import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../__constant__";
import { createGroup, groupMenu, groupsCommand } from "../__util__";

test("20. 그룹 목록 항목은 간격 없이 PC 39px·모바일 46.8px 높이의 행으로 표시한다", async ({ page }) => {
  await page.goto("/");
  await groupsCommand(page).click();
  await createGroup(page, "Spacing check");

  const items = groupMenu(page).locator(".group-item");
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    const first = (await items.nth(0).boundingBox())!;
    const second = (await items.nth(1).boundingBox())!;
    expect(first.height).toBeCloseTo(viewport.width <= 640 ? 46.8 : 39, 1);
    expect(second.y - first.y - first.height).toBeCloseTo(0, 1);
  }
});
