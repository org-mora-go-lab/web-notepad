import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";
import { bookmarksCommand } from "../../__util__";

test("7. PC와 모바일의 하단 메뉴 구분자를 모두 숨긴다", async ({ page }) => {
  await page.goto("/");
  const shortcut = page.locator(".shortcut-command");
  const bookmarkSeparator = bookmarksCommand(page).locator(".status-separator");
  const groupSeparator = page.locator(".group-status-command .status-separator");
  const visibleSeparators = page.locator(".status-meta .status-separator:visible");
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await expect(bookmarkSeparator).toHaveCount(1);
    await expect(groupSeparator).toHaveCount(0);
    await expect(bookmarkSeparator).toHaveText("|");
    await expect(bookmarkSeparator).toBeHidden();
    await expect(shortcut.locator(".status-separator")).toHaveCount(0);
    await expect(visibleSeparators).toHaveCount(0);
  }
});
