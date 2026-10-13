import { expect, test } from "@playwright/test";

import { openPanel } from "../__util__";
import { dashboardColumn, seedDashboardTabs } from "./__util__";

test("7. 비어 있는 컬럼도 카드 하나가 들어갈 만큼의 공간을 유지한다", async ({ page }) => {
  await seedDashboardTabs(page);
  await openPanel(page, "dashboard-panel");
  const card = (await dashboardColumn(page, "todo").locator(".dashboard-card").boundingBox())!;

  await dashboardColumn(page, "todo").locator(".dashboard-card").dragTo(dashboardColumn(page, "done"));
  await expect(dashboardColumn(page, "todo").locator(".dashboard-card")).toHaveCount(0);
  const empty = (await dashboardColumn(page, "todo").locator(".dashboard-cards").boundingBox())!;
  expect(empty.height).toBeGreaterThanOrEqual(card.height);
});
