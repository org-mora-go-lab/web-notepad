import { expect, test } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../../__fixture__";
import { openPanel, writeStoredState } from "../../__util__";
import { dashboardColumn } from "../__util__";

test("8. 카드는 고정, 북마크, 일반 순서로 표시한다", async ({ page }) => {
  await writeStoredState(page, {
    activeGroupId: "ungrouped",
    groups: [
      createGroupFixture("ungrouped", "Ungrouped", [
        createTabFixture("tab-1", "Plain first"),
        createTabFixture("tab-2", "Bookmarked first", { bookmarked: true }),
        createTabFixture("tab-3", "Pinned first", { pinned: true }),
        createTabFixture("tab-4", "Pinned second", {
          pinned: true,
          bookmarked: true,
        }),
        createTabFixture("tab-5", "Bookmarked second", { bookmarked: true }),
        createTabFixture("tab-6", "Plain second"),
      ]),
    ],
    nextTabNumber: 7,
  });
  await openPanel(page, "dashboard-panel");

  await expect(
    dashboardColumn(page, "in-progress").locator(".dashboard-card strong"),
  ).toHaveText([
    "Pinned first",
    "Pinned second",
    "Bookmarked first",
    "Bookmarked second",
    "Plain first",
    "Plain second",
  ]);
});
