import type { Page } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../../../__fixture__";
import { writeStoredState } from "../../../__util__";

export function seedAllGroupOriginTabs(page: Page) {
  return writeStoredState(page, {
    activeGroupId: "all-group",
    groups: [
      createGroupFixture("ungrouped", "Ungrouped", [
        createTabFixture("ungrouped-tab", "First note"),
      ]),
      createGroupFixture("work", "Work", [
        createTabFixture("work-tab", "Work only task"),
      ]),
    ],
  });
}
