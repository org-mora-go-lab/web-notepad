import { expect, test } from "@playwright/test";

import { groupMenu, groupsCommand } from "../__util__";

test("15. 그룹을 생성해도 그룹 드롭다운을 열린 상태로 유지한다", async ({ page }) => {
  await page.goto("/");
  await groupsCommand(page).click();

  const menu = groupMenu(page);
  await menu.getByRole("textbox", { name: "새 그룹 이름" }).fill("New group");
  await menu.getByRole("button", { name: "그룹 생성" }).click();

  await expect(menu).toBeVisible();
  await expect(groupsCommand(page)).toHaveAttribute("aria-expanded", "true");
  await expect(menu.locator(".group-item").filter({ hasText: "New group" })).toBeVisible();

  // The create row sits right below Ungrouped, above the other groups.
  const formBox = (await menu.locator(".group-create-form").boundingBox())!;
  const ungroupedBox = (await menu.locator(".group-item").filter({ hasText: "Ungrouped" }).boundingBox())!;
  const newGroupBox = (await menu.locator(".group-item").filter({ hasText: "New group" }).boundingBox())!;
  expect(formBox.y).toBeGreaterThanOrEqual(ungroupedBox.y + ungroupedBox.height);
  expect(newGroupBox.y).toBeGreaterThanOrEqual(formBox.y + formBox.height);
});
