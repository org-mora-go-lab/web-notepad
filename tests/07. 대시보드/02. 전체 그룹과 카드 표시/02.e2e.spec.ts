import { expect, test } from "@playwright/test";

import { openPanel, readStoredState, switchGroup } from "../../__util__";
import { dashboardColumn, seedDashboardTabs } from "../../__util__";

test("2. All Group에서 카드를 옮기면 소속 그룹의 상태를 변경한다", async ({ page }) => {
  await seedDashboardTabs(page);
  await switchGroup(page, "All Group");
  await openPanel(page, "dashboard-panel");
  await dashboardColumn(page, "todo").locator(".dashboard-card", { hasText: "Work only task" }).dragTo(dashboardColumn(page, "in-progress"));

  const work = (await readStoredState(page)).groups.find((group) => group.id === "work")!;
  expect(work.tabs[0].tabColor).toBe("green");
});
