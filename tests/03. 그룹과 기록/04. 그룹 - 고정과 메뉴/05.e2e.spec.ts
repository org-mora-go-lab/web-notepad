import { expect, test } from "@playwright/test";

import { groupMenu, groupsCommand } from "../../__util__";

test("5. All Group과 Ungrouped는 그룹 패널에 표시하지 않는다", async ({ page }) => {
  await page.goto("/");
  await groupsCommand(page).click();
  const menu = groupMenu(page);

  await expect(menu.getByRole("button", { name: "All Group", exact: true })).toHaveCount(0);
  await expect(menu.getByRole("button", { name: "Ungrouped", exact: true })).toHaveCount(0);
});
