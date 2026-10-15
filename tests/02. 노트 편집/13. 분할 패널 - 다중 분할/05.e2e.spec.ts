import { expect, test } from "@playwright/test";

import { paneSlot, seedQuadState } from "../__util__";

test("5. 하단 패널의 마지막 탭을 닫으면 해당 열의 상하 분할을 해제한다", async ({ page }) => {
  await seedQuadState(page);
  await expect(page.locator(".pane-slot")).toHaveCount(4);

  await paneSlot(page, "left-bottom").getByRole("button", { name: "Close left-bottom" }).click();
  await expect(page.locator(".pane-slot")).toHaveCount(3);
  await expect(paneSlot(page, "left-bottom")).toHaveCount(0);
  await expect(page.locator('.pane-column[data-column="left"] .pane-slot')).toHaveCount(1);

});
