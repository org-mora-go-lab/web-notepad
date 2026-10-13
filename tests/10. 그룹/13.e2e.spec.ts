import { expect, test } from "@playwright/test";

import { groupsCommand, seedSortableGroups } from "../__util__";

test("13. 그룹은 한글 우선 한국어 문자순으로 정렬하고 Ungrouped는 맨 아래에 고정한다", async ({ page }) => {
  await seedSortableGroups(page);
  await groupsCommand(page).click();

  await expect(page.locator(".group-item .group-select strong")).toHaveText([
    "가방",
    "나무",
    "다람쥐",
    "Alpha",
    "Zulu",
    "Ungrouped",
    "All Group",
  ]);
});
