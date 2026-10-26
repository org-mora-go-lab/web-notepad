import type { Page } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../../__fixture__";
import { seedStoredStateOnce } from "./stored-state";

// Seeds unsorted groups once per session (reloads keep the app state), then opens the app.
export async function seedSortableGroups(page: Page) {
  const groups = [
    ["ungrouped", "Ungrouped"],
    ["zulu", "Zulu"],
    ["daram", "다람쥐"],
    ["alpha", "Alpha"],
    ["namu", "나무"],
    ["gabang", "가방"],
  ].map(([id, name], index) =>
    createGroupFixture(
      id,
      name,
      [createTabFixture(`tab-${index + 1}`, name)],
      {
        createdAt: index,
      },
    ),
  );
  await seedStoredStateOnce(
    page,
    { activeGroupId: "ungrouped", groups },
    "group-sort-seed",
  );
}
