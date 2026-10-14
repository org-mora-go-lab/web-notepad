import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";
import { bookmarkActiveTab, closeActiveTabWithContent } from "../../__util__";

test("5. PC 하단 라벨은 14px·그룹명은 16px, 모바일 그룹명은 17px이며 북마크 붉은 점은 지름 7px다", async ({ page }) => {
  await page.goto("/");
  await closeActiveTabWithContent(page, "closed note");
  await bookmarkActiveTab(page, "note");
  const labels = page.locator(".status-meta .status-command > span:not(.status-separator):not(.status-icon):not(.group-select-name)");

  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    if (viewport.width > 640) {
      for (const label of await labels.all()) await expect(label).toHaveCSS("font-size", "14px");
    }
    await expect(page.locator(".group-select-name")).toHaveCSS("font-size", viewport.width <= 640 ? "17px" : "16px");
    await expect(page.locator(".status-count")).toHaveCount(0);
    await expect(page.locator(".bookmark-command .status-dot")).toHaveCSS("width", "7px");
    await expect(page.locator(".bookmark-command .status-dot")).toHaveCSS("height", "7px");
  }
});
