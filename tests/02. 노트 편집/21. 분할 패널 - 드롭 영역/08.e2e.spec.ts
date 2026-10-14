import { expect, test } from "@playwright/test";

import { hoverTabOverPane, paneSlot, seedQuadState } from "../__util__";

test("8. 4분할 상태의 기존 패널에는 Move here만 표시한다", async ({ page }) => {
  await seedQuadState(page);
  const target = paneSlot(page, "right-bottom");
  const source = page.locator(".tab-item").filter({ hasText: /^left-top$/ });
  const release = await hoverTabOverPane(page, source, target, 0.5, 0.75);
  await expect(target.locator(".note-pane-drop")).toHaveText(["Move here"]);
  await release();
  await expect(page.locator(".pane-slot")).toHaveCount(4);
});
