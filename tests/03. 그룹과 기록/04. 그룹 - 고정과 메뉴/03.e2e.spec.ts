import { expect, test } from "@playwright/test";

import { chooseGroupAction, groupsCommand, seedSortableGroups } from "../../__util__";

test("3. 고정한 그룹의 Unpin 명령은 고정을 해제하고 원래 정렬 위치로 되돌린다", async ({ page }) => {
  await seedSortableGroups(page);
  await groupsCommand(page).click();
  await chooseGroupAction(page, "Zulu", "고정");
  await chooseGroupAction(page, "Zulu", "고정 해제");

  await expect(page.locator(".group-item .group-select strong")).toHaveText([
    "All Group", "Ungrouped", "가방", "나무", "다람쥐", "Alpha", "Zulu",
  ]);
  await expect(page.locator(".group-item").filter({ hasText: "Zulu" }).locator(".group-pin-indicator")).toHaveCount(0);
});
