import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../../__constant__";
import { openPanel, readStoredState } from "../../__util__";
import { dashboardColumn, seedDashboardTabs } from "../__util__";

test.use({ hasTouch: true, isMobile: true, viewport: MOBILE_VIEWPORT });

test("3. 모바일에서 고정 탭을 Closed로 옮겨도 고정과 열린 상태를 유지한다", async ({ page }) => {
  await seedDashboardTabs(page);
  const tab = page.locator(".tab-item").filter({ hasText: "Alpha task" });
  await tab.getByRole("tab").dblclick();
  await page.getByRole("menuitem", { name: "Pin", exact: true }).click();
  await openPanel(page, "dashboard-panel");
  await dashboardColumn(page, "todo").locator(".dashboard-card", { hasText: "Alpha task" }).getByRole("button", { name: "Closed", exact: true }).click();

  await expect(page.getByRole("alertdialog")).toHaveCount(0);
  await expect(tab).toHaveCount(1);
  await expect(dashboardColumn(page, "done")).toContainText("Alpha task");
  expect((await readStoredState(page)).groups[0].tabs.find((item) => item.id === "tab-1")?.pinned).toBe(true);
});
