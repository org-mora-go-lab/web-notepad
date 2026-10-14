import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";
import { createGroup, groupMenu, groupsCommand } from "../../__util__";

test("8. All Group과 Ungrouped는 한 줄에 반씩 나눠 표시하고 나머지 그룹은 아래에 두며 모든 행은 PC 39px·모바일 46.8px 높이로 표시한다", async ({ page }) => {
  await page.goto("/");
  await groupsCommand(page).click();
  await createGroup(page, "Spacing check");

  const items = groupMenu(page).locator(".group-item");
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    const rowHeight = viewport.width <= 640 ? 46.8 : 39;
    await expect.poll(async () => (await items.nth(0).boundingBox())!.height).toBeCloseTo(rowHeight, 1);
    const [allGroup, ungrouped, created] = await Promise.all([0, 1, 2].map((index) => items.nth(index).boundingBox()));
    await expect(items.nth(0)).toContainText("All Group");
    await expect(items.nth(1)).toContainText("Ungrouped");
    expect(ungrouped!.y).toBeCloseTo(allGroup!.y, 1);
    expect(ungrouped!.x).toBeCloseTo(allGroup!.x + allGroup!.width + 4, 1);
    expect(ungrouped!.width).toBeCloseTo(allGroup!.width, 1);
    expect(created!.height).toBeCloseTo(rowHeight, 1);
    expect(created!.y).toBeGreaterThan(allGroup!.y + allGroup!.height);
  }
});
