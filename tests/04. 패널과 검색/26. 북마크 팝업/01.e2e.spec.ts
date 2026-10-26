import { expect, test } from "@playwright/test";

import { openBookmarksPanel, openGlobalSearchPanel } from "../../__util__";

test("1. 북마크는 우측 하단 팝업으로 열고 작업 영역을 줄이지 않는다", async ({ page }) => {
  for (const width of [1280, 320]) {
    await page.setViewportSize({ width, height: 800 }); await page.goto("/");
    const workspace = page.locator(".workspace"), before = (await workspace.boundingBox())!.width;
    await openBookmarksPanel(page);
    const popup = page.locator("#bookmarks-panel"), box = (await popup.boundingBox())!, footer = (await page.locator(".footer").boundingBox())!;
    expect(width - box.x - box.width).toBeCloseTo(16, 0);
    expect(box.y + box.height).toBeCloseTo(footer.y - 8, 0);
    expect((await workspace.boundingBox())!.width).toBeCloseTo(before, 0);
    await expect(popup.locator(".side-panel-resizer, .side-panel-pin, .side-panel-drawer")).toHaveCount(0);
    await page.keyboard.press("Escape"); await openGlobalSearchPanel(page);
    const search = (await page.locator("#global-search-popup").boundingBox())!;
    expect(search.width).toBeCloseTo(box.width, 0);
    expect(search.height).toBeCloseTo(box.height, 0);
    expect(search.y + search.height).toBeCloseTo(box.y + box.height, 0);
    expect(search.x + search.width).toBeCloseTo(box.x + box.width, 0);
    await page.keyboard.press("Escape");
  }
});
