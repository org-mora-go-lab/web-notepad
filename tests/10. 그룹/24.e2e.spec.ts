import { expect, test } from "@playwright/test";

import { groupsCommand, seedSortableGroups } from "../__util__";

test("24. 그룹 목록 맨 아래에 All Group을 표시하고 동작 버튼 없이 선택하면 하단 버튼에 표시한다", async ({ page }) => {
  await seedSortableGroups(page);
  await groupsCommand(page).click();
  const items = page.locator(".group-item");
  await expect(items.last()).toContainText("All Group");
  await expect(items.last().locator("button:not(.group-select)")).toHaveCount(0);

  await items.last().getByRole("button", { name: "All Group", exact: true }).click();
  await expect(page.locator("#groups-menu")).toHaveCount(0);
  await expect(page.locator(".group-select-name")).toHaveText("All Group");
});
