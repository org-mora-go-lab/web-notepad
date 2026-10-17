import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";
import { activeTab, openPanel, openTabMenu } from "../../__util__";

test("8. 빈 북마크 안내는 북마크를 추가하면 목록으로 바뀐다", async ({ page }) => {
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await openPanel(page, "bookmarks-panel");
    const panel = page.locator("#bookmarks-panel");
    await expect(panel.locator(".bookmark-empty")).toHaveText("Empty Bookmarks");
    await expect(panel.locator(".search-empty-state")).toHaveCount(0);
    await panel.getByRole("button", { name: "Close Bookmarks" }).click();
    await page.locator("textarea").fill("New bookmark\nSaved body");
    await openTabMenu(activeTab(page), viewport);
    await page.getByRole("menuitem", { name: "Bookmark", exact: true }).click();
    await openPanel(page, "bookmarks-panel");
    await expect(panel.locator(".bookmark-empty")).toHaveCount(0);
    await expect(panel.locator(".bookmark-item")).toHaveCount(1);
    await expect(panel.locator(".bookmark-item-heading strong")).toHaveText("New bookmark");
    await panel.getByRole("button", { name: "Close Bookmarks" }).click();
    await page.evaluate(() => localStorage.clear());
  }
});
