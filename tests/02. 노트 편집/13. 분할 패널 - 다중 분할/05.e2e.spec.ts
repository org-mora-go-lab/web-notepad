import { expect, test } from "@playwright/test";

import { dragTabToZone, paneSlot, seedQuadState } from "../__util__";

test("5. 상단 패널이 비면 같은 열의 하단 패널을 상단으로 올린다", async ({ page }) => {
  await seedQuadState(page);
  const rightTopTab = paneSlot(page, "right").locator(".tab-item");
  await dragTabToZone(page, rightTopTab, paneSlot(page, "left"), "Move here");

  await expect(paneSlot(page, "right").locator("textarea")).toHaveValue("right-bottom");
  await expect(paneSlot(page, "right-bottom")).toHaveCount(0);
});
