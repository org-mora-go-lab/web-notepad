import { expect, test } from "@playwright/test";

import { openPanel } from "../../__util__";
import { dashboardPanel, seedDashboardTabs } from "../__util__";

test("5. 상태 개수의 오른쪽 padding은 10px로 표시한다", async ({ page }) => {
  await seedDashboardTabs(page);
  await openPanel(page, "dashboard-panel");

  await expect(dashboardPanel(page).locator(".dashboard-count").first()).toHaveCSS(
    "padding-right",
    "10px",
  );
});
