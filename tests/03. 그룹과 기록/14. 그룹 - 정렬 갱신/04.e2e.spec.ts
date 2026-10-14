import { expect, test } from "@playwright/test";

import { createGroup, groupMenu, groupsCommand } from "../../__util__";

test("4. 새 그룹을 생성해도 그룹 드롭다운을 열린 상태로 유지한다", async ({ page }) => {
  await page.goto("/");
  await groupsCommand(page).click();
  await createGroup(page, "New group");

  await expect(groupMenu(page)).toBeVisible();
  await expect(groupsCommand(page)).toHaveAttribute("aria-expanded", "true");
});
