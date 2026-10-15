import { expect, test } from "@playwright/test";

import { groupsCommand, seedSortableGroups } from "../../__util__";

test("2. 이름 있는 그룹은 한글 이름을 먼저 배치하고 한국어 기준 문자순으로 정렬한다", async ({ page }) => {
  await seedSortableGroups(page);
  await groupsCommand(page).click();

  await expect(page.locator(".group-item .group-select strong")).toHaveText([
    "Closed",
    "가방",
    "나무",
    "다람쥐",
    "Alpha",
    "Zulu",
  ]);
});
