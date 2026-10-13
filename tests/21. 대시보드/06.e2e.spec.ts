import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT, MOBILE_VIEWPORT } from "../__constant__";
import { openPanel } from "../__util__";
import { dashboardPanel, seedDashboardTabs } from "./__util__";

test("6. PC는 세 컬럼을 가로로, 모바일은 세로로 쌓아 표시한다", async ({ page }) => {
  await seedDashboardTabs(page);
  await openPanel(page, "dashboard-panel");
  const columns = dashboardPanel(page).locator(".dashboard-column");

  await page.setViewportSize(DESKTOP_VIEWPORT);
  const desktop = await Promise.all((await columns.all()).map((column) => column.boundingBox()));
  expect(desktop[0]!.y).toBeCloseTo(desktop[1]!.y, 0);
  expect(desktop[1]!.x).toBeGreaterThan(desktop[0]!.x);
  expect(desktop[2]!.x).toBeGreaterThan(desktop[1]!.x);

  await page.setViewportSize(MOBILE_VIEWPORT);
  const mobile = await Promise.all((await columns.all()).map((column) => column.boundingBox()));
  expect(mobile[1]!.y).toBeGreaterThan(mobile[0]!.y);
  expect(mobile[2]!.y).toBeGreaterThan(mobile[1]!.y);
  expect(mobile[0]!.x).toBeCloseTo(mobile[1]!.x, 0);
});
