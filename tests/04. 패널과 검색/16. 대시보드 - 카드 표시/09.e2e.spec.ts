import { expect, test } from "@playwright/test";

import { openPanel } from "../../__util__";
import { dashboardPanel, seedDashboardTabs } from "../__util__";

test("9. 카드 모서리는 6px로 둥글게 표시한다", async ({ page }) => {
  await seedDashboardTabs(page);
  await openPanel(page, "dashboard-panel");
  await expect(dashboardPanel(page).locator(".dashboard-card").first()).toHaveCSS(
    "border-radius",
    "6px",
  );
});
