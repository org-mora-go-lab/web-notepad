import { expect, test } from "@playwright/test";

import { createTabFixture } from "../../__fixture__";
import { dashboardColumn, openPanel, restoreWorkspace } from "../../__util__";

test("2. Note 보조 상태는 주기 색상보다 우선해 복원한다", async ({ page }) => {
  await restoreWorkspace(page, {
    tabs: [
      createTabFixture("tab-1", "Explicit Note", {
        tabColor: "teal",
        dashboardStatus: "icebox",
      }),
    ],
    dashboardVisibility: { icebox: true, closed: false },
  });
  await openPanel(page, "dashboard-panel");
  await expect(
    dashboardColumn(page, "icebox").locator(".dashboard-card"),
  ).toContainText("Explicit Note");
  await expect(
    dashboardColumn(page, "done").locator(".dashboard-card"),
  ).toHaveCount(0);
});
