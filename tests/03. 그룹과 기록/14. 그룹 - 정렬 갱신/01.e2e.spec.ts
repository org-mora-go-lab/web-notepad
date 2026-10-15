import { expect, test } from "@playwright/test";

import { createGroup, groupsCommand, seedSortableGroups } from "../../__util__";

test("1. 새 그룹을 생성한 직후 이름 있는 그룹에 같은 정렬을 적용한다", async ({ page }) => {
  await seedSortableGroups(page);
  await groupsCommand(page).click();
  await createGroup(page, "Beta");

  await expect(page.locator(".group-item .group-select strong")).toHaveText([
    "All",
    "Ungrouped",
    "Closed",
    "가방",
    "나무",
    "다람쥐",
    "Alpha",
    "Beta",
    "Zulu",
  ]);
});
