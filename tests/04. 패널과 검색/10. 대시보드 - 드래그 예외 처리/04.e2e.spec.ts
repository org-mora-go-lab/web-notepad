import { expect, test } from "@playwright/test";

import {
  createClosedTabFixture,
  createGroupFixture,
  createTabFixture,
} from "../../__fixture__";
import { openPanel, writeStoredState } from "../../__util__";
import { dashboardPanel } from "../__util__";

test("4. 공백·탭·개행만 있는 닫은 탭은 카드와 개수에서 제외한다", async ({ page }) => {
  await writeStoredState(page, {
    activeGroupId: "ungrouped",
    groups: [
      createGroupFixture("ungrouped", "Ungrouped", [
        createTabFixture("tab-1", "Visible", { tabColor: "gray" }),
      ]),
    ],
    closedTabs: [
      createClosedTabFixture(
        "closed-whitespace",
        "ungrouped",
        createTabFixture("tab-2", " \t\n", { tabColor: "purple" }),
      ),
    ],
    nextTabNumber: 3,
  });
  await openPanel(page, "dashboard-panel");

  await expect(dashboardPanel(page).locator(".dashboard-card")).toHaveCount(1);
  await expect(
    dashboardPanel(page).locator(".dashboard-statuses .dashboard-count"),
  ).toHaveText(["1", "0", "0"]);
});
