import { expect, test } from "@playwright/test";

import { groupsCommand, seedSortableGroups } from "../../__util__";

test("1. All, Ungrouped, Closed를 그룹 목록의 첫 줄에 두고 나머지 그룹을 그 아래에 배치한다", async ({ page }) => {
  await seedSortableGroups(page);
  await groupsCommand(page).click();

  const items = page.locator(".group-item");
  await expect(items.nth(0)).toContainText("All");
  await expect(items.nth(1)).toContainText("Ungrouped");
  await expect(items.nth(2)).toContainText("Closed");
  const [allGroup, ungrouped, closed, firstNamed] = await Promise.all([
    items.nth(0).boundingBox(),
    items.nth(1).boundingBox(),
    items.nth(2).boundingBox(),
    items.nth(3).boundingBox(),
  ]);
  expect(ungrouped!.y).toBeCloseTo(allGroup!.y, 1);
  expect(closed!.y).toBeCloseTo(allGroup!.y, 1);
  expect(firstNamed!.y).toBeGreaterThan(allGroup!.y + allGroup!.height);
});
