import { expect, test } from "@playwright/test";

import {
  openBookmarksPanel,
  openGlobalSearchPanel,
  openPanel,
} from "../../__util__";

test("5. 검색과 북마크는 열린 대시보드를 피해 같은 작업 영역 위치와 크기를 유지한다", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  await openPanel(page, "dashboard-panel");
  test.setTimeout(60000);
  const sizes = new Map<number, { width: number; height: number }>();
  for (const [openPopup, id] of [
    [openGlobalSearchPanel, "#global-search-popup"],
    [openBookmarksPanel, "#bookmarks-panel"],
  ] as const) {
    await page.setViewportSize({ width: 1280, height: 900 });
    await openPopup(page);
    const popup = page.locator(id);
    for (const width of [1280, 1000]) {
      await page.setViewportSize({ width, height: 900 });
      await expect
        .poll(async () => {
          const footer = (await page.locator(".footer").boundingBox())!;
          const box = (await popup.boundingBox())!;
          return Math.abs(box.x + box.width - footer.x - footer.width + 16);
        })
        .toBeLessThan(2);
      const box = (await popup.boundingBox())!;
      const footer = (await page.locator(".footer").boundingBox())!;
      expect(box.y + box.height).toBeCloseTo(footer.y - 8, 0);
      const size = sizes.get(width);
      if (size) {
        expect(box.width).toBeCloseTo(size.width, 0);
        expect(box.height).toBeCloseTo(size.height, 0);
      } else sizes.set(width, { width: box.width, height: box.height });
      await expect(page.locator("#dashboard-panel")).toHaveAttribute(
        "aria-hidden",
        "false",
      );
    }
    await page.keyboard.press("Escape");
  }
});
