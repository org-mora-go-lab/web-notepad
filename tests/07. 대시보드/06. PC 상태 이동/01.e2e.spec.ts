import { expect, test } from "@playwright/test";

import { openPanel } from "../../__util__";
import { dashboardColumn, dashboardPanel, seedDashboardTabs } from "../../__util__";

test("1. PC에서 카드를 다른 컬럼으로 드래그하면 상태와 탭 색상을 바꾼다", async ({ page }) => {
  await seedDashboardTabs(page);
  await openPanel(page, "dashboard-panel");
  const card = dashboardPanel(page).locator(".dashboard-card").filter({ hasText: "Alpha task" });
  await card.dragTo(dashboardColumn(page, "in-progress"));
  await expect(card).toHaveAttribute("data-tab-color", "indigo");
  await card.dragTo(dashboardColumn(page, "todo"));
  await expect(card).toHaveAttribute("data-tab-color", "gray");
});
