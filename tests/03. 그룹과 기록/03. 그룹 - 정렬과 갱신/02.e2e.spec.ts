import { expect, test } from "@playwright/test";

import { groupsCommand, seedSortableGroups } from "../../__util__";

test("2. 변경한 그룹 순서를 새로고침 후 복원한다", async ({ page }) => {
  await seedSortableGroups(page);
  await groupsCommand(page).click();
  const handle = page.locator('[data-group-id="zulu"] .group-reorder');
  await handle.focus();
  await handle.press("ArrowUp");
  await page.reload();
  await expect(page.locator(".group-item .group-select strong")).toHaveText(["가방", "나무", "다람쥐", "Zulu", "Alpha"]);
});
