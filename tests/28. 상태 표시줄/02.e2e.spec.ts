import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT, MOBILE_VIEWPORT } from "../__constant__";
import { bookmarksCommand, chooseTabMenuItem } from "../__util__";

test("2. BOOKMARK는 개수를 표시하지 않고 오늘 변경된 북마크가 있으면 아이콘 우측 상단에서 오른쪽 5px·위 3px 벗어난 위치에 붉은 점을 표시한다", async ({ page }) => {
  await page.goto("/");
  const dot = bookmarksCommand(page).locator(".status-dot");
  await expect(dot).toHaveCount(0);

  await chooseTabMenuItem(page, "Bookmark");
  await expect(bookmarksCommand(page).locator(".status-count")).toHaveCount(0);
  await expect(bookmarksCommand(page)).not.toContainText("1");

  for (const viewport of [DESKTOP_VIEWPORT, MOBILE_VIEWPORT]) {
    await page.setViewportSize(viewport);
    await expect(dot).toBeVisible();
    await expect(dot).toBeInViewport();
    await expect(dot).toHaveCSS("border-radius", "50%");
    await expect(dot).toHaveCSS("background-color", "rgb(255, 92, 92)");

    const iconBounds = (await bookmarksCommand(page).locator("svg").boundingBox())!;
    const dotBounds = (await dot.boundingBox())!;
    const labelBounds = (await bookmarksCommand(page).locator(".status-label").boundingBox())!;
    const iconBox = (await bookmarksCommand(page).locator(".status-icon").boundingBox())!;
    expect(dotBounds.x + dotBounds.width).toBeCloseTo(iconBox.x + iconBox.width + 5, 0);
    expect(dotBounds.y).toBeCloseTo(iconBox.y - 3, 0);
    expect(dotBounds.x).toBeGreaterThan(iconBounds.x + iconBounds.width / 2);
    if (viewport.width > 640) {
      expect(dotBounds.x + dotBounds.width).toBeLessThanOrEqual(labelBounds.x);
    } else {
      expect(dotBounds.y + dotBounds.height).toBeLessThanOrEqual(labelBounds.y);
    }
  }
});
