import { expect, test } from "@playwright/test";

import { openPanel } from "../../__util__";
import { dashboardColumn, seedDashboardTabs } from "../__util__";

test("7. PC의 빈 컬럼은 카드 하나가 들어갈 최소 높이를 유지하고 평상시 테두리를 표시하지 않는다", async ({ page }) => {
  await seedDashboardTabs(page);
  await openPanel(page, "dashboard-panel");
  const card = (await dashboardColumn(page, "todo").locator(".dashboard-card").boundingBox())!;
  await dashboardColumn(page, "todo").locator(".dashboard-card").dragTo(dashboardColumn(page, "done"));
  const cards = dashboardColumn(page, "todo").locator(".dashboard-cards");
  await expect(cards.locator(".dashboard-card")).toHaveCount(0);
  expect((await cards.boundingBox())!.height).toBeGreaterThanOrEqual(card.height);
  await expect(cards).toHaveCSS("border-top-width", "0px");
});
