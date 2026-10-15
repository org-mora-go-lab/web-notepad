import { expect, test } from "@playwright/test";

import { chooseGroupAction, groupsCommand, seedSortableGroups } from "../../__util__";

test("1. 그룹을 고정하면 이름 있는 그룹 목록의 맨 위로 옮기고 핀 아이콘을 표시한다", async ({ page }) => {
  await seedSortableGroups(page);
  await groupsCommand(page).click();
  await chooseGroupAction(page, "Zulu", "고정");

  await expect(page.locator(".group-item .group-select strong")).toHaveText([
    "Closed", "Zulu", "가방", "나무", "다람쥐", "Alpha",
  ]);
  await expect(page.locator(".group-item").filter({ hasText: "Zulu" }).locator(".group-pin-indicator")).toBeVisible();
});
