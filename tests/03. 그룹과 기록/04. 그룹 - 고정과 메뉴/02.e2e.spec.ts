import { expect, test } from "@playwright/test";

import { groupsCommand, seedSortableGroups } from "../../__util__";

test("2. 그룹 드롭다운에는 그룹 추가만 표시하고 섹션 추가는 표시하지 않는다", async ({
  page,
}) => {
  await seedSortableGroups(page);
  await groupsCommand(page).click();
  await page.locator(".system-group-command").click();
  await expect(
    page.getByRole("textbox", { name: "New group name" }),
  ).toBeVisible();
  await expect(page.locator(".group-section-create-form")).toHaveCount(0);
});
