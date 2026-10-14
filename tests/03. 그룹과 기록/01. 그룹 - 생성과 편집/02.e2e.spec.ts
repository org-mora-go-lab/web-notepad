import { expect, test } from "@playwright/test";

import { createGroups, groupMenu, groupsCommand, groupStatusName } from "../../__util__";

test("2. PC에서 그룹을 선택하면 드롭다운을 열린 채 유지한다", async ({ page }) => {
  await page.goto("/");
  await createGroups(page, "Work");
  await groupsCommand(page).click();

  await groupMenu(page)
    .locator(".group-item")
    .filter({ hasText: "Ungrouped" })
    .getByRole("button", { name: "Ungrouped", exact: true })
    .click();

  await expect(groupStatusName(page)).toHaveText("Ungrouped");
  await expect(groupMenu(page)).toBeVisible();
});
