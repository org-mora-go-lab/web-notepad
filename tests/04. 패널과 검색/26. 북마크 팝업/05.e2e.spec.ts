import { expect, test } from "@playwright/test";

import {
  openBookmarksPanel,
  openGlobalSearchPanel,
  openPanel,
} from "../../__util__";

test("5. 검색과 북마크는 열린 대시보드 위에서도 같은 위쪽 배치와 크기를 유지한다", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  await openPanel(page, "dashboard-panel");
  test.setTimeout(60000);
  const dashboardWidth = (await page.locator("#dashboard-panel").boundingBox())!
    .width;
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
          const box = (await popup.boundingBox())!;
          return Math.abs(box.x + box.width / 2 - width / 2);
        })
        .toBeLessThan(2);
      const box = (await popup.boundingBox())!;
      expect(box.y + box.height / 2).toBeCloseTo(370, 0);
      const size = sizes.get(width);
      if (size) {
        expect(box.width).toBeCloseTo(size.width, 0);
        expect(box.height).toBeCloseTo(size.height, 0);
      } else sizes.set(width, { width: box.width, height: box.height });
      await expect(page.locator("#dashboard-panel")).toHaveAttribute(
        "aria-hidden",
        "false",
      );
      expect(
        (await page.locator("#dashboard-panel").boundingBox())!.width,
      ).toBeCloseTo(dashboardWidth, 0);
    }
    await page.keyboard.press("Escape");
  }
});
