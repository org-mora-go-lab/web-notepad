import { expect, test } from "@playwright/test";

import { openPanel } from "../../__util__";
import { dashboardColumn, dashboardPanel, seedDashboardTabs } from "../__util__";

test("5. Closed 카드의 열기 버튼을 누르면 닫은 탭을 원래 상태로 복원한다", async ({ page }) => {
  await seedDashboardTabs(page);
  await openPanel(page, "dashboard-panel");
  await dashboardColumn(page, "todo").locator(".dashboard-card", { hasText: "Alpha task" }).dragTo(dashboardColumn(page, "done"));
  const closed = dashboardColumn(page, "done").locator(".dashboard-card", { hasText: "Alpha task" });
  await closed.locator(".dashboard-card-open").click();

  await expect(page.locator("textarea")).toHaveValue(/Alpha task/);
  await expect(dashboardPanel(page)).toHaveAttribute("aria-hidden", "true");
});
