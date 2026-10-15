import { expect, test } from "@playwright/test";

import {
  createClosedTabFixture,
  createGroupFixture,
  createTabFixture,
} from "../../__fixture__";
import { openPanel, readStoredState, writeStoredState } from "../../__util__";
import { dashboardColumn, dashboardPanel } from "../__util__";

test("4. 일반적이지 않은 닫은 탭 ID의 카드를 WIP으로 옮겨도 닫힌 상태를 유지한다", async ({ page }) => {
  await writeStoredState(page, {
    activeGroupId: "ungrouped",
    groups: [
      createGroupFixture("ungrouped", "Ungrouped", [
        createTabFixture("tab-1", "Open note", { tabColor: "gray" }),
      ]),
    ],
    closedTabs: [
      createClosedTabFixture(
        "archived-entry-1",
        "ungrouped",
        createTabFixture("tab-2", "Legacy archived note", {
          tabColor: "purple",
        }),
      ),
    ],
    nextTabNumber: 3,
  });
  await openPanel(page, "dashboard-panel");

  await dashboardColumn(page, "done")
    .locator(".dashboard-card", { hasText: "Legacy archived note" })
    .dragTo(dashboardColumn(page, "in-progress"));

  await expect(dashboardColumn(page, "in-progress")).toContainText(
    "Legacy archived note",
  );
  await expect(dashboardPanel(page).locator(".dashboard-card")).toHaveCount(2);
  const stored = await readStoredState(page);
  expect(stored.closedTabs).toHaveLength(1);
  expect(stored.closedTabs?.[0].tab.tabColor).toBe("green");
  await expect(page.locator(".tab-item", { hasText: "Legacy archived note" })).toHaveCount(0);
});
