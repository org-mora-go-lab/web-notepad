import { expect, test } from "@playwright/test";

import { seedSortableGroups, switchGroup } from "../../__util__";

test("1. All Group은 모든 그룹의 탭을 하나의 편집기에 모아 표시한다", async ({ page }) => {
  await seedSortableGroups(page);
  await switchGroup(page, "All Group");

  await expect(page.locator(".tab-item")).toHaveCount(6);
  for (const title of ["Ungrouped", "Zulu", "다람쥐", "Alpha", "나무", "가방"]) {
    await expect(page.getByRole("tab", { name: title, exact: true })).toHaveCount(1);
  }
  await expect(page.locator(".pane-slot")).toHaveCount(1);
});
