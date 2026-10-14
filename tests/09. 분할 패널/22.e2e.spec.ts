import { expect, test } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../__fixture__";
import { writeStoredState } from "../__util__";
import { hoverTabOverPane, paneSlot } from "./__util__";

test("22. 상단 탭 1과 하단 탭 2·3에서 탭 3을 우측 분할 영역에 드롭한다", async ({ page }) => {
  for (const allGroup of [false, true]) {
    const group = createGroupFixture("ungrouped", "Ungrouped", ["1", "2", "3"].map((id) => createTabFixture(id, id)), {
      leftBottomTabIds: ["2", "3"], activeLeftBottomTabId: "3",
    });
    await writeStoredState(page, {
      activeGroupId: allGroup ? "all-group" : "ungrouped", groups: [group],
      ...(allGroup ? { allGroupLayout: group } : {}),
    });
    const bottom = paneSlot(page, "left-bottom");
    await hoverTabOverPane(page, bottom.getByRole("tab", { name: "3", exact: true }).locator(".tab-title"), bottom, 0.8, 0.75);
    await expect(bottom.locator(".note-pane-drop")).toHaveText(["Split right"]);
    await page.mouse.up();
    await expect(paneSlot(page, "right").locator("textarea")).toHaveValue("3");
    await expect(bottom.locator("textarea")).toHaveValue("2");
    await expect(paneSlot(page, "left").locator("textarea")).toHaveValue("1");
  }
});
