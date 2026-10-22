import { expect, test } from "@playwright/test";

import { chooseGroupAction, createGroup, groupActionsButton, groupsCommand } from "../../__util__";

test("4. 기본 Ungrouped 그룹은 삭제할 수 없다", async ({ page }) => {
  await page.goto("/");
  await groupsCommand(page).click();
  await createGroup(page, "Work");

  await groupActionsButton(page, "Work").click();
  await expect(page.getByRole("button", { name: "Delete Work group", exact: true })).toBeVisible();
  await groupActionsButton(page, "Work").click();
  const ungrouped = page.locator(".group-system-item", { has: page.getByRole("button", { name: "Ungrouped", exact: true }) });
  await expect(ungrouped.locator(".group-actions")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Delete Ungrouped group" })).toHaveCount(0);
  await chooseGroupAction(page, "Work", "고정");
});
