import { expect, test } from "@playwright/test";

import { openPanel } from "../__util__";
import { dashboardColumn, dashboardPanel, seedDashboardTabs } from "./__util__";

test("3. 카드를 drag & drop으로 컬럼에 옮기면 상태에 맞는 탭 색상으로 바뀌고 새로고침 후에도 유지하며 화살표 버튼은 없다", async ({ page }) => {
  await seedDashboardTabs(page);
  await openPanel(page, "dashboard-panel");
  await expect(dashboardPanel(page).locator(".dashboard-card button:not(.dashboard-card-open)")).toHaveCount(0);
  const card = (title: string) => dashboardPanel(page).locator(".dashboard-card").filter({ hasText: title });

  await card("Alpha task").dragTo(dashboardColumn(page, "in-progress"));
  await expect(dashboardColumn(page, "in-progress")).toContainText("Alpha task");
  await expect(card("Alpha task")).toHaveAttribute("data-tab-color", "green");
  await card("Alpha task").dragTo(dashboardColumn(page, "done"));
  await expect(dashboardColumn(page, "done")).toContainText("Alpha task");
  await expect(card("Alpha task")).toHaveAttribute("data-tab-color", "purple");
  await card("Gamma task").dragTo(dashboardColumn(page, "todo"));
  await expect(dashboardColumn(page, "todo")).toContainText("Gamma task");
  await expect(card("Gamma task")).toHaveAttribute("data-tab-color", "gray");
  await expect(page.locator(".tab-item").filter({ hasText: "Alpha task" })).toHaveAttribute("data-tab-color", "purple");

  await page.reload();
  await expect(dashboardPanel(page)).toHaveAttribute("aria-hidden", "false");
  await expect(dashboardColumn(page, "done")).toContainText("Alpha task");
  await expect(dashboardColumn(page, "todo")).toContainText("Gamma task");
});
