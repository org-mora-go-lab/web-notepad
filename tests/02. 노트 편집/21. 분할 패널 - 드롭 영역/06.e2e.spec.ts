import { expect, test } from "@playwright/test";

import { hoverTabOverPane, paneSlot } from "../__util__";

test("6. 원래 패널에 탭이 하나뿐이면 해당 탭의 분할 영역을 표시하지 않는다", async ({ page }) => {
  await page.goto("/");
  const left = paneSlot(page, "left");
  const release = await hoverTabOverPane(page, left.locator(".tab-item"), left, 0.25, 0.75);
  await expect(left.locator(".note-pane-drop", { hasText: /Split/ })).toHaveCount(0);
  await release();
  await expect(page.locator(".pane-slot")).toHaveCount(1);
});
