import { expect, test } from "@playwright/test";

import { groupsCommand, seedSortableGroups } from "../../__util__";

test("3. 그룹 목록 맨 위에 All Group을 표시하고 동작 버튼 없이 선택하면 하단 버튼에 표시하고 드롭다운은 열린 채 유지한다", async ({ page }) => {
  await seedSortableGroups(page);
  await groupsCommand(page).click();
  const items = page.locator(".group-item");
  await expect(items.first()).toContainText("All Group");
  await expect(items.first().locator("button:not(.group-select)")).toHaveCount(0);

  await items.first().getByRole("button", { name: "All Group", exact: true }).click();
  await expect(page.locator(".group-select-name")).toHaveText("All Group");
  // Selecting a group keeps the dropdown open until an outside click, Escape or the group button closes it.
  await expect(page.locator("#groups-menu")).toBeVisible();
  await groupsCommand(page).click();
  await expect(page.locator("#groups-menu")).toHaveCount(0);
  await expect(page.locator(".pane-slot")).toHaveCount(1);
  await page.reload();
  await expect(page.locator(".group-select-name")).toHaveText("All Group");
});
