import type { Page } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../../../../__fixture__";
import { writeStoredState } from "../../../../__util__";

export const seedAllGroupState = (page: Page) => writeStoredState(page, {
  activeGroupId: "all-group",
  groups: [
    createGroupFixture("ungrouped", "Ungrouped", [createTabFixture("a", "a"), createTabFixture("b", "b")]),
    createGroupFixture("work", "Work", [createTabFixture("c", "c"), createTabFixture("d", "d")]),
  ],
});
