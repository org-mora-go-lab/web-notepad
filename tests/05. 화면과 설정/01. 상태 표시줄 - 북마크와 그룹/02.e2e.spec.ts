import { expect, test } from "@playwright/test";

import { chooseTabMenuItem, moreCommand } from "../../__util__";

test("2. 더보기는 북마크 명령이나 북마크 상태 표시를 포함하지 않는다", async ({ page }) => {
  await page.goto("/");
  const command = moreCommand(page);
  await chooseTabMenuItem(page, "Bookmark");
  await command.click();
  await expect(page.locator("#footer-more-menu")).not.toContainText("BOOKMARK");
  await expect(command.locator(".status-count")).toHaveCount(0);
  await expect(command.locator(".status-dot")).toHaveCount(0);
});
