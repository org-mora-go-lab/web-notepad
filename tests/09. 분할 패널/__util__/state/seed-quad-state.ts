import type { Page } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../../../__fixture__";
import { seedStoredStateOnLoad } from "../../../__util__";

// Seeds a four-pane view with one tab per pane, named after its pane, then opens the app.
export async function seedQuadState(page: Page, leftRowRatio = 0.5) {
  await seedStoredStateOnLoad(page, {
    activeGroupId: "ungrouped",
    nextTabNumber: 5,
    groups: [
      createGroupFixture(
        "ungrouped",
        "Ungrouped",
        ["left-top", "left-bottom", "right-top", "right-bottom"].map((id) => createTabFixture(id, id)),
        {
          rightTabIds: ["right-top"],
          activeRightTabId: "right-top",
          leftBottomTabIds: ["left-bottom"],
          activeLeftBottomTabId: "left-bottom",
          rightBottomTabIds: ["right-bottom"],
          activeRightBottomTabId: "right-bottom",
          leftRowRatio,
        },
      ),
    ],
  });
}

export const paneSlot = (page: Page, pane: string) => page.locator(`.pane-slot[data-pane="${pane}"]`);
