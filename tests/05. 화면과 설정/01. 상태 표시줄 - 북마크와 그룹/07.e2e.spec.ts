import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT, MOBILE_VIEWPORT } from "../../__constant__";
import { bookmarksCommand, chooseTabMenuItem } from "../../__util__";

test("7. BOOKMARK 붉은 점은 아이콘 우측 상단에서 5px·3px 벗어나 라벨과 겹치지 않는다", async ({ page }) => {
  await page.goto("/");
  await chooseTabMenuItem(page, "Bookmark");
  const command = bookmarksCommand(page);
  const dot = command.locator(".status-dot");

  for (const viewport of [DESKTOP_VIEWPORT, MOBILE_VIEWPORT]) {
    await page.setViewportSize(viewport);
    await expect(dot).toBeVisible();
    await expect(dot).toBeInViewport();
    const iconBounds = (await command.locator("svg").boundingBox())!;
    const dotBounds = (await dot.boundingBox())!;
    const iconBox = (await command.locator(".status-icon").boundingBox())!;
    expect(dotBounds.x + dotBounds.width).toBeCloseTo(iconBox.x + iconBox.width + 5, 0);
    expect(dotBounds.y).toBeCloseTo(iconBox.y - 3, 0);
    expect(dotBounds.x).toBeGreaterThan(iconBounds.x + iconBounds.width / 2);
    if (viewport.width > 640) {
      const labelBounds = (await command.locator(".status-label").boundingBox())!;
      expect(dotBounds.x + dotBounds.width).toBeLessThanOrEqual(labelBounds.x);
    }
  }
});
