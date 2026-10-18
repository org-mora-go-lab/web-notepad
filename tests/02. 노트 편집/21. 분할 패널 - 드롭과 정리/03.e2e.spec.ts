import { expect, test } from "@playwright/test";

import { hoverTabOverPane, paneSlot, seedSplitState } from "../__util__";

test("3. 마지막 탭을 다른 기존 패널로 옮길 때는 Move here만 표시한다", async ({ page }) => {
  await seedSplitState(page);
  const target = paneSlot(page, "right");
  const release = await hoverTabOverPane(
    page,
    paneSlot(page, "left").locator(".tab-item"),
    target,
    0.5,
    0.75,
  );
  await expect(target.locator(".note-pane-drop")).toHaveText(["Move here"]);
  await release();
});
