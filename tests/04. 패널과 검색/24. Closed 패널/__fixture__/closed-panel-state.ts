import type { Page } from "@playwright/test";

import {
  createClosedTabFixture,
  createGroupFixture,
  createTabFixture,
} from "../../../__fixture__";
import { writeStoredState } from "../../../__util__";

export function seedClosedPanelState(page: Page) {
  return writeStoredState(page, {
    activeGroupId: "ungrouped",
    groups: [
      createGroupFixture("ungrouped", "Ungrouped", [
        createTabFixture("open-1", "Open note"),
      ]),
      createGroupFixture("work", "Work", [
        createTabFixture("open-2", "Work note"),
      ]),
    ],
    closedTabs: [
      createClosedTabFixture(
        "closed-1",
        "ungrouped",
        createTabFixture("tab-closed-1", "Archived note\nArchived body", {
          tabColor: "purple",
        }),
      ),
      createClosedTabFixture(
        "closed-2",
        "work",
        createTabFixture("tab-closed-2", "Work archive", {
          tabColor: "purple",
        }),
      ),
    ],
    nextTabNumber: 3,
  });
}
