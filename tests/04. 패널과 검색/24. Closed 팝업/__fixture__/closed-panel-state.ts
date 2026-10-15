import type { Page } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../../../__fixture__";
import { writeStoredState } from "../../../__util__";

export function seedClosedPanelState(page: Page, entryCount = 1) {
  return writeStoredState(page, {
    activeGroupId: "ungrouped",
    groups: [
      createGroupFixture("ungrouped", "Ungrouped", [
        createTabFixture("open-1", "Open note", { tabColor: "orange" }),
        createTabFixture("tab-closed-1", "Archived note\nArchived body", {
          dashboardStatus: "closed",
          tabColor: "purple",
        }),
        ...Array.from({ length: entryCount - 1 }, (_, index) =>
          createTabFixture(
            `tab-closed-extra-${index}`,
            `Archived extra ${index}\nArchived body ${index}`,
            { dashboardStatus: "closed" },
          ),
        ),
      ]),
      createGroupFixture("work", "Work", [
        createTabFixture("open-2", "Work note"),
        createTabFixture("tab-closed-2", "Work archive", {
          dashboardStatus: "closed",
          tabColor: "purple",
        }),
      ]),
    ],
    nextTabNumber: 3,
  });
}
