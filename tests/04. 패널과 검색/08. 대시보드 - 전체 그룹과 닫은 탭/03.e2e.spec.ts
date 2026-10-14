import { expect, test } from "@playwright/test";

import { openPanel } from "../../__util__";
import { dashboardColumn, seedDashboardTabs } from "../__util__";

test("3. Closed 컬럼은 현재 그룹의 열린 Closed 상태 탭과 닫은 탭을 함께 표시하고 개수에 포함한다", async ({ page }) => {
  await seedDashboardTabs(page);
  await openPanel(page, "dashboard-panel");
  await dashboardColumn(page, "todo").locator(".dashboard-card", { hasText: "Alpha task" }).dragTo(dashboardColumn(page, "done"));

  await expect(dashboardColumn(page, "done").locator(".dashboard-card")).toHaveCount(2);
  await expect(page.locator('.dashboard-statuses [data-status="done"] .dashboard-count')).toHaveText("2");
});
