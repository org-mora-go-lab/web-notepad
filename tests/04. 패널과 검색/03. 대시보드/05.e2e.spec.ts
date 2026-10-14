import { expect, test } from "@playwright/test";

import { openPanel } from "../../__util__";
import { dashboardColumn, dashboardPanel, seedDashboardTabs } from "./__util__";

test("5. 카드를 누르면 해당 탭을 활성화하고 패널을 닫는다", async ({ page }) => {
  await seedDashboardTabs(page);
  await expect(page.locator("textarea")).toHaveValue("Alpha task\nalpha body");
  await openPanel(page, "dashboard-panel");
  await dashboardColumn(page, "done").locator(".dashboard-card-open").click();
  await expect(page.locator("textarea")).toHaveValue("Gamma task");
  await expect(dashboardPanel(page)).toHaveAttribute("aria-hidden", "true");
});
