import { expect, test } from "@playwright/test";

import { groupsCommand, openPanel, readStoredState } from "../../__util__";
import { dashboardColumn, dashboardPanel, seedDashboardTabs } from "../__util__";

test("1. All Group의 대시보드는 모든 그룹의 탭을 모아 보여주고 소속 그룹의 상태를 바꾼다", async ({ page }) => {
  await seedDashboardTabs(page);
  await groupsCommand(page).click();
  await page.locator(".group-item").first().getByRole("button", { name: "All Group", exact: true }).click();
  await openPanel(page, "dashboard-panel");

  await expect(dashboardPanel(page).locator(".dashboard-card")).toHaveCount(4);
  const workCard = dashboardColumn(page, "todo").locator(".dashboard-card").filter({ hasText: "Work only task" });
  await expect(workCard.locator(".dashboard-card-group")).toHaveText("Work");

  await workCard.dragTo(dashboardColumn(page, "done"));
  await expect(dashboardColumn(page, "done")).toContainText("Work only task");
  const stored = await readStoredState(page);
  const closed = stored.closedTabs?.find((entry) => entry.groupId === "work");
  expect(closed?.tab.tabColor).toBe("purple");
  expect(stored.groups.find((group) => group.id === "ungrouped")!.tabs[0].tabColor).toBe("gray");
});
