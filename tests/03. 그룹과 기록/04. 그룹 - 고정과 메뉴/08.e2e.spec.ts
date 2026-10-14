import { expect, test } from "@playwright/test";

import { groupMenu, groupsCommand } from "../../__util__";

test("8. All Group과 Ungrouped에는 그룹 동작 버튼을 표시하지 않는다", async ({ page }) => {
  await page.goto("/");
  await groupsCommand(page).click();
  const menu = groupMenu(page);

  await expect(menu.getByRole("button", { name: "All Group group actions" })).toHaveCount(0);
  await expect(menu.getByRole("button", { name: "Ungrouped group actions" })).toHaveCount(0);
  await expect(menu.locator(".group-item").nth(0).locator("button:not(.group-select)")).toHaveCount(0);
  await expect(menu.locator(".group-item").nth(1).locator("button:not(.group-select)")).toHaveCount(0);
});
