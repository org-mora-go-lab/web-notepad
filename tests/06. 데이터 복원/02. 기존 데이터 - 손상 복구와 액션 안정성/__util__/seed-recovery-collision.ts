import type { Page } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../../../__fixture__";
import { seedStoredStateOnLoad } from "../../../__util__";

export const seedRecoveryCollision = (page: Page) =>
  seedStoredStateOnLoad(page, {
    activeGroupId: "ungrouped",
    nextTabNumber: 2,
    groups: [
      { id: "ungrouped", name: "Ungrouped", tabs: [] },
      createGroupFixture(
        "work",
        "Work",
        [createTabFixture("tab-1", "Work note")],
        {
          bookmarks: [2, 3].map((number) => ({
            id: `bookmark-${number}`,
            sourceTabId: `tab-${number}`,
            title: `Archived note ${number}`,
            content: `Archived note ${number}`,
            tabColor: "green",
            selectedLines: [],
            createdAt: 1,
            updatedAt: 1,
          })),
        },
      ),
    ],
  });
