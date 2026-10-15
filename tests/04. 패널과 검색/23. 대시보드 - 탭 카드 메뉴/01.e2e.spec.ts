import { expect, test } from "@playwright/test";

import { openPanel } from "../../__util__";
import { dashboardColumn, seedDashboardTabs } from "../__util__";

test("1. PC 대시보드 탭 카드 메뉴에 Pin·Unpin을 표시하지 않는다", async ({ page }) => {
  await seedDashboardTabs(page);
  await openPanel(page, "dashboard-panel");
  const card = dashboardColumn(page, "todo").locator(".dashboard-card", {
    hasText: "Alpha task",
  });

  await card.click({ button: "right" });
  await expect(page.getByRole("menuitem", { name: "Pin", exact: true })).toHaveCount(0);
  await expect(page.getByRole("menuitem", { name: "Unpin", exact: true })).toHaveCount(0);
});
