import { expect, test } from "@playwright/test";

import { chooseTabMenuItem, groupsCommand } from "../../__util__";

test("4. 그룹 오른쪽 아이콘의 BOOKMARK는 해당 그룹의 북마크 패널을 연다", async ({ page }) => {
  await page.goto("/");
  await chooseTabMenuItem(page, "Bookmark");
  await groupsCommand(page).click();
  const row = page.locator(".group-system-item", { has: page.getByRole("button", { name: "Ungrouped", exact: true }) });
  await row.locator(".group-actions > button").click();
  await row.getByRole("button", { name: "Ungrouped · BOOKMARK" }).click();

  await expect(page.locator("#bookmarks-panel")).toHaveAttribute("aria-hidden", "false");
  await expect(page.locator("#bookmarks-panel")).toContainText("Empty note");
});
