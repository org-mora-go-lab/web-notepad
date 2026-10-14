import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../../__constant__";
import { openPanel, readStoredState } from "../../__util__";
import { dashboardColumn, seedDashboardTabs } from "../__util__";

test.use({ hasTouch: true, isMobile: true, viewport: MOBILE_VIEWPORT });

test("3. 모바일에서 고정 탭을 Closed로 옮기면 확인하고 고정을 해제한 뒤 닫는다", async ({ page }) => {
  await seedDashboardTabs(page);
  const tab = page.locator(".tab-item").filter({ hasText: "Alpha task" });
  await tab.getByRole("tab").dblclick();
  await page.getByRole("menuitem", { name: "Pin", exact: true }).click();
  await openPanel(page, "dashboard-panel");
  await dashboardColumn(page, "todo").locator(".dashboard-card", { hasText: "Alpha task" }).getByRole("button", { name: "Closed", exact: true }).click();

  const confirmation = page.getByRole("alertdialog", { name: "Move to Closed" });
  await expect(confirmation).toBeVisible();
  await confirmation.getByRole("button", { name: "Unpin and close" }).click();
  await expect(tab).toHaveCount(0);
  await expect(dashboardColumn(page, "done")).toContainText("Alpha task");
  expect((await readStoredState(page)).closedTabs?.[0].tab.pinned).toBe(false);
});
