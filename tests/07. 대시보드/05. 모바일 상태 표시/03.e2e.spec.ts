import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../../__constant__";
import { openPanel } from "../../__util__";
import { dashboardPanel, seedDashboardTabs } from "../../__util__";

test.use({ hasTouch: true, isMobile: true, viewport: MOBILE_VIEWPORT });

test("3. 모바일의 Todo↔Doing과 Doing↔Done 상태 영역 사이는 각각 30px 간격으로 표시한다", async ({ page }) => {
  await seedDashboardTabs(page);
  await openPanel(page, "dashboard-panel");

  const columns = dashboardPanel(page).locator(".dashboard-column");
  const boxes = await Promise.all(
    (await columns.all()).map((column) => column.boundingBox()),
  );

  expect(boxes[1]!.y - (boxes[0]!.y + boxes[0]!.height)).toBeCloseTo(30, 0);
  expect(boxes[2]!.y - (boxes[1]!.y + boxes[1]!.height)).toBeCloseTo(30, 0);
});
