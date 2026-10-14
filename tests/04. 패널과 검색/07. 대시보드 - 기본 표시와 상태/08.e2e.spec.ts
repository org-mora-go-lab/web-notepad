import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../../__constant__";
import { openPanel } from "../../__util__";
import { dashboardColumn, seedDashboardTabs } from "../__util__";

test("8. 모바일 빈 컬럼은 남는 높이를 늘리지 않고 다음 상태 제목을 바로 이어 표시한다", async ({ page }) => {
  await page.setViewportSize(MOBILE_VIEWPORT);
  await seedDashboardTabs(page);
  await openPanel(page, "dashboard-panel");
  await dashboardColumn(page, "todo").locator(".dashboard-card").dragTo(dashboardColumn(page, "done"));
  const empty = (await dashboardColumn(page, "todo").locator(".dashboard-cards").boundingBox())!;
  const nextTitle = (await dashboardColumn(page, "in-progress").locator(".dashboard-column-status").boundingBox())!;
  expect(empty.height).toBeLessThanOrEqual(80);
  expect(nextTitle.y).toBeGreaterThanOrEqual(empty.y + empty.height);
});
