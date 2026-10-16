import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";
import { createGroupFixture, createTabFixture } from "../../__fixture__";
import { dashboardPanel, openPanel, toggleDashboardStatus, writeStoredState } from "../../__util__";

test("7. 상태 이름은 기본 이름으로 표시하고 PC와 모바일에서 수정 기능을 제공하지 않는다", async ({ page }) => {
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await writeStoredState(page, {
      activeGroupId: "ungrouped",
      groups: [createGroupFixture("ungrouped", "Ungrouped", [createTabFixture("tab-1", "Task")])],
      settings: {
        dashboardStatusNames: { icebox: "Later", todo: "Backlog", "in-progress": "Working", done: "Finished", closed: "Archived" },
      },
    });
    await openPanel(page, "dashboard-panel");
    const panel = dashboardPanel(page);
    const titles = panel.locator(viewport.width <= 512 ? ".dashboard-column-status" : ".dashboard-statuses h3");

    for (let load = 0; load < 2; load += 1) {
      await toggleDashboardStatus(page, "icebox");
      await toggleDashboardStatus(page, "closed");
      await expect(titles.locator(".dashboard-status-label")).toHaveText(["ICEBOX", "Todo", "Doing", "Done", "Closed"]);
      await titles.nth(1).hover();
      await titles.nth(1).click();
      await expect(titles.getByRole("button")).toHaveCount(0);
      await expect(titles.getByRole("textbox")).toHaveCount(0);
      await expect(titles.locator(".dashboard-status-label").nth(1)).toHaveText("Todo");
      if (load === 0) await page.reload();
    }
  }
});
