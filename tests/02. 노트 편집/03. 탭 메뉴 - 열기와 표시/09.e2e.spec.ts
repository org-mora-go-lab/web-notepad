import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../../__constant__";
import { createPinnedAndBookmarkedTabs } from "../../__util__";

test.use({ hasTouch: true });

test("9. 모바일 핀 아이콘을 더블탭하면 해당 탭 메뉴를 연다", async ({ page }) => {
  await page.setViewportSize(MOBILE_VIEWPORT);
  const { pinnedTab } = await createPinnedAndBookmarkedTabs(page);
  await pinnedTab.getByRole("tab").click();
  await pinnedTab.locator(".tab-pin-indicator").dblclick();
  await expect(page.getByRole("menuitem", { name: "Unpin", exact: true })).toHaveCount(0);
  await expect(page.getByRole("menuitem", { name: "Bookmark", exact: true })).toBeVisible();
});
