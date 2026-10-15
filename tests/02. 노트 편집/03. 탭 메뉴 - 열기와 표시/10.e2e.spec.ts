import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../../__constant__";
import { createPinnedAndBookmarkedTabs } from "../../__util__";

test.use({ hasTouch: true });

test("10. 모바일 북마크 아이콘을 더블탭하면 해당 탭 메뉴를 연다", async ({ page }) => {
  await page.setViewportSize(MOBILE_VIEWPORT);
  const { bookmarkedTab } = await createPinnedAndBookmarkedTabs(page);
  await bookmarkedTab.getByRole("tab").click();
  await bookmarkedTab.locator(".tab-bookmark-indicator").dblclick();
  await expect(page.getByRole("menuitem", { name: "Pin", exact: true })).toHaveCount(0);
  await expect(page.getByRole("menuitem", { name: "Remove bookmark", exact: true })).toBeVisible();
});
