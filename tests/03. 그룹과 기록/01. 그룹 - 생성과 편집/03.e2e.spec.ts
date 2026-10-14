import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../../__constant__";
import { createGroups, groupMenu, groupsCommand, groupStatusName } from "../../__util__";

test("3. 모바일에서 그룹을 선택하면 드롭다운을 바로 닫는다", async ({ page }) => {
  await page.setViewportSize(MOBILE_VIEWPORT);
  await page.goto("/");
  await createGroups(page, "Work");
  await groupsCommand(page).click();

  await groupMenu(page)
    .locator(".group-item")
    .filter({ hasText: "Ungrouped" })
    .getByRole("button", { name: "Ungrouped", exact: true })
    .click();

  await expect(groupStatusName(page)).toHaveText("Ungrouped");
  await expect(groupMenu(page)).toHaveCount(0);
});
