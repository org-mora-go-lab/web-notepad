import { expect, test } from "@playwright/test";

import { groupsCommand, seedSortableGroups } from "../../__util__";

test("1. 그룹은 한글 우선 한국어 문자순으로 정렬하고 All Group과 Ungrouped를 맨 위에 두고 나머지를 정렬한다", async ({ page }) => {
  await seedSortableGroups(page);
  await groupsCommand(page).click();

  await expect(page.locator(".group-item .group-select strong")).toHaveText([
    "All Group",
    "Ungrouped",
    "가방",
    "나무",
    "다람쥐",
    "Alpha",
    "Zulu",
  ]);
});
