import { expect, test } from "@playwright/test";

import { groupsCommand, seedSortableGroups } from "../../__util__";

test("1. 그룹 패널은 Closed 다음에 이름 있는 그룹만 배치한다", async ({ page }) => {
  await seedSortableGroups(page);
  await groupsCommand(page).click();

  const items = page.locator(".group-item");
  await expect(items.nth(0)).toContainText("Closed");
  await expect(page.getByRole("button", { name: "All Group", exact: true })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Ungrouped", exact: true })).toHaveCount(0);
  const [closed, firstNamed] = await Promise.all([
    items.nth(0).boundingBox(),
    items.nth(1).boundingBox(),
  ]);
  expect(firstNamed!.y).toBeGreaterThanOrEqual(closed!.y + closed!.height);
});
