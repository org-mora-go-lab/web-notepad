import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT } from "../../__constant__";
import { bookmarksCommand, openPanel } from "../../__util__";

test("1. 고정한 Bookmark 패널에서 BOOKMARK 명령을 다시 선택하면 패널을 닫는다", async ({ page }) => {
  await page.setViewportSize(DESKTOP_VIEWPORT);
  await page.goto("/");
  await openPanel(page, "bookmarks-panel");
  await bookmarksCommand(page).click();
  await expect(page.locator("#bookmarks-panel")).toHaveAttribute("aria-hidden", "true");
});
