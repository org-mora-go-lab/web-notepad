import type { Page } from "@playwright/test";

import { createClosedTabFixture, createGroupFixture, createTabFixture } from "../../../__fixture__";
import { openClosedPanel, writeStoredState } from "../../../__util__";

export async function seedClosedTabIdCollision(page: Page) {
  await writeStoredState(page, {
    groups: [
      createGroupFixture("ungrouped", "Ungrouped", [createTabFixture("tab-1", "open note")]),
    ],
    activeGroupId: "ungrouped",
    nextTabNumber: 2,
    closedTabs: [
      createClosedTabFixture(
        "closed-collision",
        "ungrouped",
        createTabFixture("tab-1", "archived note"),
      ),
    ],
  });
  await openClosedPanel(page);
}
