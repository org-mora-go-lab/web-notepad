import { expect, test } from "@playwright/test";

import { openPanel } from "../../__util__";
import { dashboardColumn, seedDashboardTabs } from "../__util__";

test("7. 비어 있는 컬럼도 카드 하나가 들어갈 공간을 유지하고 평상시 테두리를 표시하지 않는다", async ({ page }) => {
  await seedDashboardTabs(page);
  await openPanel(page, "dashboard-panel");
  const card = (await dashboardColumn(page, "todo").locator(".dashboard-card").boundingBox())!;
  await dashboardColumn(page, "todo").locator(".dashboard-card").dragTo(dashboardColumn(page, "done"));
  await expect(dashboardColumn(page, "todo").locator(".dashboard-card")).toHaveCount(0);
  const empty = (await dashboardColumn(page, "todo").locator(".dashboard-cards").boundingBox())!;
  expect(empty.height).toBeGreaterThanOrEqual(card.height);
  await expect(dashboardColumn(page, "todo").locator(".dashboard-cards")).toHaveCSS("border-top-width", "0px");
});
