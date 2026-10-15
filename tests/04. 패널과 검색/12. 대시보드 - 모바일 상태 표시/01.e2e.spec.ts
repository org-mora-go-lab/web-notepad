import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../../__constant__";
import { openPanel } from "../../__util__";
import { dashboardPanel, seedDashboardTabs } from "../__util__";

test.use({ hasTouch: true, isMobile: true, viewport: MOBILE_VIEWPORT });

test("1. 모바일 카드에 Todo·WIP·Closed 상태 변경 버튼을 표시하지 않는다", async ({ page }) => {
  await seedDashboardTabs(page);
  await openPanel(page, "dashboard-panel");

  await expect(
    dashboardPanel(page).locator(".dashboard-card-status-actions"),
  ).toHaveCount(0);
});
