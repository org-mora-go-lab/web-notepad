import { expect, test } from "@playwright/test";

import { groupsCommand, seedSortableGroups } from "../../__util__";

test("2. All Group 선택을 저장하고 새로고침 후 복원한다", async ({ page }) => {
  await seedSortableGroups(page);
  await groupsCommand(page).click();
  await page.getByRole("button", { name: "All Group", exact: true }).click();
  await page.reload();

  await expect(page.locator(".group-select-name")).toHaveText("All Group");
  await expect(page.locator(".tab-item")).toHaveCount(6);
});
