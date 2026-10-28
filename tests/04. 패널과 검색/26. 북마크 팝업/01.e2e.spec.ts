import { expect, test } from "@playwright/test";

import { openBookmarksPanel, openGlobalSearchPanel } from "../../__util__";

test("1. 북마크는 화면 중앙 모달로 열고 작업 영역을 줄이지 않는다", async ({
  page,
}) => {
  for (const width of [1280, 320]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto("/");
    const workspace = page.locator(".workspace"),
      before = (await workspace.boundingBox())!.width;
    await openBookmarksPanel(page);
    const popup = page.locator("#bookmarks-panel"),
      box = (await popup.boundingBox())!;
    expect(box.width).toBeCloseTo(Math.min(420, width - 32), 0);
    expect(box.height).toBeCloseTo(416, 0);
    expect(box.x + box.width / 2).toBeCloseTo(width / 2, 0);
    expect(box.y + box.height / 2).toBeCloseTo(400, 0);
    expect(await popup.evaluate((element) => element.matches(":modal"))).toBe(
      true,
    );
    expect(
      await popup.evaluate(
        (element) => getComputedStyle(element, "::backdrop").backgroundColor,
      ),
    ).toBe("rgba(0, 0, 0, 0.65)");
    expect((await workspace.boundingBox())!.width).toBeCloseTo(before, 0);
    await expect(
      popup.locator(".side-panel-resizer, .side-panel-pin, .side-panel-drawer"),
    ).toHaveCount(0);
    await page.keyboard.press("Escape");
    await openGlobalSearchPanel(page);
    const search = (await page.locator("#global-search-popup").boundingBox())!;
    expect(search.width).toBeCloseTo(box.width, 0);
    expect(search.height).toBeCloseTo(box.height, 0);
    expect(search.y).toBeCloseTo(box.y, 0);
    expect(search.x).toBeCloseTo(box.x, 0);
    await page.keyboard.press("Escape");
  }
});
