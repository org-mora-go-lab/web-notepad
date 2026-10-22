import { expect, test } from "@playwright/test";

import { groupsCommand, moreCommand } from "../../__util__";

test("2. 더보기의 마지막 Bookmark 명령은 현재 그룹의 북마크 패널을 연다", async ({ page }) => {
  await page.goto("/");
  await groupsCommand(page).click();
  const command = moreCommand(page);
  await command.click();
  const menu = page.locator("#footer-more-menu");
  await expect(menu.getByRole("button")).toHaveText(["GUIDE", "SETTINGS", "SEARCH", "Bookmark"]);
  await menu.getByRole("button", { name: "Bookmark" }).click();
  await expect(page.locator("#bookmarks-panel")).toHaveAttribute("aria-hidden", "false");
  await expect(page.locator("#groups-menu")).toBeVisible();
  await expect(command.locator(".status-count")).toHaveCount(0);
  await expect(command.locator(".status-dot")).toHaveCount(0);
});
