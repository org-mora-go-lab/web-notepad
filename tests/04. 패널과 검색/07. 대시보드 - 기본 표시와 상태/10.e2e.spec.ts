import { expect, test } from "@playwright/test";

import { openPanel } from "../../__util__";
import { dashboardPanel, seedDashboardTabs } from "../__util__";

test("10. 대시보드 컬럼 사이 간격을 15px로 표시한다", async ({ page }) => {
  await seedDashboardTabs(page);
  await openPanel(page, "dashboard-panel");
  await expect(dashboardPanel(page).locator(".dashboard-board")).toHaveCSS("gap", "15px");
});
