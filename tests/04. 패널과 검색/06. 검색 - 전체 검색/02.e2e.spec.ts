import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";
import { seedStoredStateOnLoad } from "../../__util__";
import { createGlobalSearchState } from "./__fixture__";

test("2. 푸터 SEARCH는 PC에서 아이콘 오른쪽, 모바일에서 아이콘 아래에 라벨을 표시한다", async ({ page }) => {
  await seedStoredStateOnLoad(page, createGlobalSearchState());
  const command = page.locator(".footer .global-search-command");
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await expect(command).toContainText("SEARCH");
    const iconBounds = (await command.locator("svg").boundingBox())!;
    const labelBounds = (await command.locator(".status-label").boundingBox())!;
    if (viewport.width <= 640) {
      expect(iconBounds.y + iconBounds.height).toBeLessThanOrEqual(labelBounds.y);
    } else {
      expect(iconBounds.x + iconBounds.width).toBeLessThanOrEqual(labelBounds.x);
      expect(iconBounds.y + iconBounds.height / 2).toBeCloseTo(labelBounds.y + labelBounds.height / 2, 0);
    }
  }
});
