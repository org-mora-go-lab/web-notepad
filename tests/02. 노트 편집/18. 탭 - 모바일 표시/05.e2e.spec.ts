import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../../__constant__";
import { createPinnedAndBookmarkedTabs, expectCssPx } from "../../__util__";

test("5. 모바일 탭 제목은 18.2px, 색상 아이콘은 가로·세로 15.6px이며 아이콘 세로 위치를 유지한다", async ({ page }) => {
  await page.goto("/");
  const { pinnedTab, bookmarkedTab } =
    await createPinnedAndBookmarkedTabs(page);
  await page.setViewportSize(MOBILE_VIEWPORT);
  const tab = bookmarkedTab;
  const title = tab.locator(".tab-title");

  await expect(title).toHaveCSS("font-size", "18.2px");
  await expectCssPx(tab.locator(".dirty-dot"), "width", 15.6, "::before");
  await expectCssPx(tab.locator(".dirty-dot"), "height", 15.6, "::before");
  await expect(page.locator(".add-tab")).toHaveCSS("padding-bottom", "1px");
  const tabBounds = (await tab.boundingBox())!;
  const titleBounds = (await title.boundingBox())!;
  const topGap = titleBounds.y - tabBounds.y;
  const bottomGap = tabBounds.y + tabBounds.height - titleBounds.y - titleBounds.height;
  expect(bottomGap - topGap).toBeCloseTo(1, 1);

  const iconCenters = await Promise.all(
    [
      tab.locator(".dirty-dot"),
      pinnedTab.locator(".tab-pin-indicator svg"),
      bookmarkedTab.locator(".tab-bookmark-indicator svg"),
      bookmarkedTab.locator(".tab-close svg"),
      page.locator(".add-tab svg"),
    ].map(async (icon) => {
      const box = (await icon.boundingBox())!;
      return box.y + box.height / 2;
    }),
  );
  expect(Math.max(...iconCenters) - Math.min(...iconCenters)).toBeLessThanOrEqual(
    1.5,
  );
});
