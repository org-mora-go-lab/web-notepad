import type { Page } from "@playwright/test";

import type { BookmarkEntry, GroupEntry } from "@/src/4-entity/notepad";

import { createGroupFixture, createTabFixture } from "../../__fixture__";
import { writeStoredState } from "../state";

export async function seedSearchWorkspace(
  page: Page,
  bookmarks: BookmarkEntry[] = [],
  otherGroups: GroupEntry[] = [],
) {
  await writeStoredState(page, {
    activeGroupId: "ungrouped",
    groups: [
      createGroupFixture(
        "ungrouped",
        "Ungrouped",
        [createTabFixture("tab-1", "Editor")],
        { bookmarks },
      ),
      ...otherGroups,
    ],
  });
}
