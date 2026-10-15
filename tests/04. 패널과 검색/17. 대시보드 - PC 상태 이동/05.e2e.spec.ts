import { expect, test } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../../__fixture__";
import { openPanel, readStoredState, writeStoredState } from "../../__util__";
import { dashboardColumn } from "../__util__";

test("5. 북마크된 긴 탭을 Closed로 옮겨도 편집기에 열린 상태를 유지한다", async ({ page }) => {
  const content = "bookmarked long task";
  const tab = createTabFixture("tab-bookmarked", content, {
    bookmarked: true,
    tabColor: "gray",
  });
  await writeStoredState(page, {
    groups: [createGroupFixture("ungrouped", "Ungrouped", [tab])],
    activeGroupId: "ungrouped",
  });
  await openPanel(page, "dashboard-panel");

  await dashboardColumn(page, "todo")
    .locator(".dashboard-card")
    .dragTo(dashboardColumn(page, "done"));

  await expect(page.getByRole("alertdialog")).toHaveCount(0);
  expect((await readStoredState(page)).closedTabs).toEqual([]);
  await expect(page.locator(".tab-item", { hasText: content })).toHaveCount(1);
});
