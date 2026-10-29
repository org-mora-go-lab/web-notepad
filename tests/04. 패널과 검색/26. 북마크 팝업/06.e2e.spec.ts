import { expect, test } from "@playwright/test";

import { openBookmarksPanel, writeStoredState } from "../../__util__";
import { createBookmarkGroupsState } from "./__fixture__";

test("6. MORE의 BOOKMARK는 모든 그룹의 북마크 내용을 표시한다", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 800 });
  await writeStoredState(page, createBookmarkGroupsState());
  await openBookmarksPanel(page);

  const items = page.locator("#bookmarks-panel .bookmark-item");
  await expect(items).toHaveCount(2);
  await expect(items.nth(0).locator("strong")).toHaveText("Work note");
  await expect(items.nth(0).locator(".bookmark-item-group")).toHaveText("Work");
  await expect(items.nth(0).locator(".bookmark-item-content")).toHaveText(
    "Work content",
  );
  await expect(items.nth(1).locator("strong")).toHaveText("Home note");
  await expect(items.nth(1).locator(".bookmark-item-group")).toHaveText(
    "Ungrouped",
  );
  await expect(items.nth(1).locator(".bookmark-item-content")).toHaveText(
    "Home content",
  );
  const bookmarkMaxHeight = await items
    .first()
    .evaluate((element) => getComputedStyle(element).maxHeight);
  expect(bookmarkMaxHeight).toBe("144px");
  await page.locator("#bookmarks-panel .corner-popover-close").click();
  await page.locator(".dashboard-command").click();
  const dashboardCard = page.locator(".dashboard-card").first();
  await expect(dashboardCard).toBeVisible();
  await expect(dashboardCard).toHaveCSS("max-height", bookmarkMaxHeight);
});
