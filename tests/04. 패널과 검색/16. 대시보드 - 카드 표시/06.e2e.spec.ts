import { expect, test } from "@playwright/test";

import { openPanel } from "../../__util__";
import { dashboardPanel, seedDashboardTabs } from "../__util__";

test("6. 상태 제목의 위아래 padding은 각각 5px로 표시한다", async ({ page }) => {
  await seedDashboardTabs(page);
  await openPanel(page, "dashboard-panel");
  const status = dashboardPanel(page).locator(".dashboard-statuses h3").first();

  await expect(status).toHaveCSS("padding-top", "5px");
  await expect(status).toHaveCSS("padding-bottom", "5px");
});
