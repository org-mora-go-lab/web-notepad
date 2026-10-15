import { expect, test } from "@playwright/test";

import { chooseGroupAction, groupsCommand, readStoredState, seedSortableGroups } from "../../__util__";

test("2. 그룹 고정 상태를 저장하고 새로고침 후 복원한다", async ({ page }) => {
  await seedSortableGroups(page);
  await groupsCommand(page).click();
  await chooseGroupAction(page, "Zulu", "고정");
  expect((await readStoredState(page)).groups.find((group) => group.id === "zulu")?.pinned).toBe(true);

  await page.reload();
  await groupsCommand(page).click();
  await expect(page.locator(".group-item .group-select strong").first()).toHaveText("Zulu");
  await expect(page.locator(".group-item").filter({ hasText: "Zulu" }).locator(".group-pin-indicator")).toBeVisible();
});
