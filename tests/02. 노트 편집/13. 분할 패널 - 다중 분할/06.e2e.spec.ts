import { expect, test } from "@playwright/test";

import { confirmTabDelete } from "../../__util__";
import { dragTabToZone, paneSlot, seedQuadState } from "../__util__";

test("6. 하단 패널이 비면 상하 분할을 해제하고 상단 패널이 비면 하단 패널을 올린다", async ({ page }) => {
  await seedQuadState(page);
  await expect(page.locator(".pane-slot")).toHaveCount(4);

  await paneSlot(page, "left-bottom").getByRole("button", { name: "left-bottom 닫기" }).click();
  await confirmTabDelete(page);
  await expect(page.locator(".pane-slot")).toHaveCount(3);
  await expect(paneSlot(page, "left-bottom")).toHaveCount(0);
  await expect(page.locator('.pane-column[data-column="left"] .pane-slot')).toHaveCount(1);

  const rightTopTab = paneSlot(page, "right").locator(".tab-item");
  await dragTabToZone(page, rightTopTab, paneSlot(page, "left"), "Move here");
  await expect(page.locator(".pane-slot")).toHaveCount(2);
  await expect(paneSlot(page, "right").locator("textarea")).toHaveValue("right-bottom");
  await expect(paneSlot(page, "right-bottom")).toHaveCount(0);
  await expect(paneSlot(page, "left").locator(".tab-item")).toHaveCount(2);
});
