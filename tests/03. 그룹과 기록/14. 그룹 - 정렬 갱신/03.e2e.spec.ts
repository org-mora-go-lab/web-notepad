import { expect, test } from "@playwright/test";

import { groupsCommand, seedSortableGroups } from "../../__util__";

test("3. 새로고침 후에도 이름 있는 그룹에 같은 정렬을 적용한다", async ({ page }) => {
  await seedSortableGroups(page);
  await page.reload();
  await groupsCommand(page).click();

  await expect(page.locator(".group-item .group-select strong")).toHaveText([
    "All",
    "Ungrouped",
    "가방",
    "나무",
    "다람쥐",
    "Alpha",
    "Zulu",
  ]);
});
