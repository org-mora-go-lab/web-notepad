import { expect, test } from "@playwright/test";

import { dragTabToZone, paneSlot, seedQuadState } from "../__util__";

test("10. 하단 패널의 마지막 탭을 옮기면 해당 열의 상하 분할을 해제한다", async ({ page }) => {
  await seedQuadState(page);
  await dragTabToZone(
    page,
    paneSlot(page, "left-bottom").locator(".tab-item"),
    paneSlot(page, "left"),
    "Move here",
  );

  await expect(page.locator(".pane-slot")).toHaveCount(3);
  await expect(paneSlot(page, "left-bottom")).toHaveCount(0);
  await expect(paneSlot(page, "left").locator(".tab-title")).toHaveText([
    "left-top",
    "left-bottom",
  ]);
});
