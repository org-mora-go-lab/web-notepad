import { expect, test } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../__fixture__";
import { writeStoredState } from "../__util__";
import { paneSlot } from "./__util__";

test("21. 하단 편집기의 탭을 오른쪽으로 분할하며 기존 우상단 탭을 유지한다", async ({ page }) => {
  for (const allGroup of [false, true]) {
    for (const hasRightTop of [true, false]) {
      const layout = {
        leftBottomTabIds: ["bottom-1", "bottom-2"],
        activeLeftBottomTabId: "bottom-2",
        rightTabIds: hasRightTop ? ["right-top"] : [],
        activeRightTabId: hasRightTop ? "right-top" : null,
      };
      await writeStoredState(page, {
        activeGroupId: allGroup ? "all-group" : "ungrouped",
        groups: [createGroupFixture("ungrouped", "Ungrouped", ["top", "bottom-1", "bottom-2", ...(hasRightTop ? ["right-top"] : [])].map((id) => createTabFixture(id, id)), allGroup ? {} : layout)],
        ...(allGroup ? { allGroupLayout: { ...layout, activeTabId: "top", rightBottomTabIds: [], activeRightBottomTabId: null, activePane: "left", splitRatio: 0.5, leftRowRatio: 0.5, rightRowRatio: 0.5 } } : {}),
      });
      const bottom = paneSlot(page, "left-bottom");
      await expect(bottom.locator(".tab-title")).toHaveText(["bottom-1", "bottom-2"]);
      const body = bottom.locator(".body");
      const box = (await body.boundingBox())!;
      await bottom.getByRole("tab", { name: "bottom-2", exact: true }).locator(".tab-title").dragTo(body, {
        targetPosition: { x: box.width * 0.75, y: box.height * 0.25 },
      });
      const target = paneSlot(page, hasRightTop ? "right-bottom" : "right");
      await expect(target.locator("textarea")).toHaveValue("bottom-2");
      await expect(bottom.locator(".tab-title")).toHaveText(["bottom-1"]);
      await expect(page.locator(".pane-slot")).toHaveCount(hasRightTop ? 4 : 3);
      if (hasRightTop) await expect(paneSlot(page, "right").locator("textarea")).toHaveValue("right-top");
      await page.reload();
      await expect(target.locator("textarea")).toHaveValue("bottom-2");
    }
  }
});
