import { expect, test } from "@playwright/test";

import {
  openBookmarksPanel,
  openGlobalSearchPanel,
  seedStoredStateOnLoad,
} from "../../__util__";
import { createGlobalSearchState } from "./__fixture__";

test("8. 검색은 빈 상태와 결과와 미리보기에서도 북마크와 같은 가로 크기를 유지한다", async ({
  page,
}) => {
  await seedStoredStateOnLoad(page, createGlobalSearchState());
  for (const width of [1280, 320]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto("/");
    await openBookmarksPanel(page);
    const bookmark = (await page.locator("#bookmarks-panel").boundingBox())!;
    await page.keyboard.press("Escape");
    await openGlobalSearchPanel(page);
    const popup = page.locator("#global-search-popup");
    for (const state of ["empty", "results", "preview"]) {
      if (state === "results") await popup.getByRole("searchbox").fill("Work");
      if (state === "preview")
        await page
          .getByRole("button", {
            name: "Preview bookmark Work plan",
            exact: true,
          })
          .click();
      await expect(popup).toHaveCSS("width", bookmark.width + "px");
      expect((await popup.boundingBox())!.height).toBeCloseTo(
        bookmark.height,
        0,
      );
    }
    const results = (await popup
      .locator(".global-search-results-pane")
      .boundingBox())!;
    const preview = (await popup
      .locator(".global-search-preview-pane")
      .boundingBox())!;
    expect(preview.y).toBeGreaterThanOrEqual(results.y + results.height - 1);
    await page.keyboard.press("Escape");
  }
});
