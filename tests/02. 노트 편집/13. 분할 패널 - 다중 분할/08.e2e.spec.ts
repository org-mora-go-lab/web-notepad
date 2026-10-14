import { expect, test } from "@playwright/test";

import { paneSlot, writePaneLayoutState } from "../__util__";

test("8. 4분할 배치와 각 패널의 활성 탭을 새로고침 후 복원한다", async ({ page }) => {
  await writePaneLayoutState(
    page,
    ["left-a", "left-b", "lower-a", "lower-b", "right-a", "right-b", "right-lower-a", "right-lower-b"],
    {
      activeTabId: "left-b",
      leftBottomTabIds: ["lower-a", "lower-b"],
      activeLeftBottomTabId: "lower-b",
      rightTabIds: ["right-a", "right-b"],
      activeRightTabId: "right-b",
      rightBottomTabIds: ["right-lower-a", "right-lower-b"],
      activeRightBottomTabId: "right-lower-b",
      activePane: "right-bottom",
    },
  );

  await page.reload();
  const expected = {
    left: "left-b",
    "left-bottom": "lower-b",
    right: "right-b",
    "right-bottom": "right-lower-b",
  };
  for (const [pane, title] of Object.entries(expected)) {
    await expect(paneSlot(page, pane).locator(".tab-item.is-active .tab-title")).toHaveText(title);
  }
  await expect(paneSlot(page, "right-bottom").locator(".note-pane")).not.toHaveClass(/is-unfocused/);
});
