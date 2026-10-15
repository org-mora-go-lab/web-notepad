import { expect, test } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../../__fixture__";
import { openPanel, writeStoredState } from "../../__util__";
import { dashboardPanel } from "../__util__";

test("2. 공백·탭·개행만 있는 열린 탭은 카드와 개수에서 제외한다", async ({ page }) => {
  await writeStoredState(page, {
    activeGroupId: "ungrouped",
    groups: [
      createGroupFixture("ungrouped", "Ungrouped", [
        createTabFixture("tab-1", "Visible", { tabColor: "gray" }),
        createTabFixture("tab-2", "   ", { tabColor: "gray" }),
        createTabFixture("tab-3", "\t\n  \n", { tabColor: "green" }),
      ]),
    ],
    nextTabNumber: 4,
  });
  await openPanel(page, "dashboard-panel");

  await expect(dashboardPanel(page).locator(".dashboard-card")).toHaveCount(1);
  await expect(
    dashboardPanel(page).locator(".dashboard-statuses .dashboard-count"),
  ).toHaveText(["1", "0", "0"]);
});
