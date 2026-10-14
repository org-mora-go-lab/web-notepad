import { expect, test } from "@playwright/test";

import { dragTabToZone, paneSlot, seedSplitState } from "../__util__";

test("7. 왼쪽 열이 비면 오른쪽 열을 왼쪽으로 옮긴다", async ({ page }) => {
  await seedSplitState(page);
  await dragTabToZone(
    page,
    paneSlot(page, "left").locator(".tab-item"),
    paneSlot(page, "right"),
    "Move here",
  );

  await expect(page.locator(".pane-slot")).toHaveCount(1);
  await expect(paneSlot(page, "right")).toHaveCount(0);
  await expect(paneSlot(page, "left").locator(".tab-item")).toHaveCount(2);
});
