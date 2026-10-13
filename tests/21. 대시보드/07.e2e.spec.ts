import { expect, test } from "@playwright/test";

import { openPanel } from "../__util__";
import { dashboardColumn, dashboardPanel, seedDashboardTabs } from "./__util__";

test("7. 비어 있는 컬럼도 카드 하나가 들어갈 만큼의 공간을 유지하고 테두리 없이 제목 아래 어디에 놓아도 이동한다", async ({ page }) => {
  await seedDashboardTabs(page);
  await openPanel(page, "dashboard-panel");
  const card = (await dashboardColumn(page, "todo").locator(".dashboard-card").boundingBox())!;

  await dashboardColumn(page, "todo").locator(".dashboard-card").dragTo(dashboardColumn(page, "done"));
  await expect(dashboardColumn(page, "todo").locator(".dashboard-card")).toHaveCount(0);
  const empty = (await dashboardColumn(page, "todo").locator(".dashboard-cards").boundingBox())!;
  expect(empty.height).toBeGreaterThanOrEqual(card.height);
  await expect(dashboardColumn(page, "todo").locator(".dashboard-cards")).toHaveCSS("border-top-width", "0px");

  // Dropping far below the title, near the bottom of the column, still moves the card.
  const column = (await dashboardColumn(page, "todo").boundingBox())!;
  const list = (await dashboardPanel(page).locator(".dashboard-list").boundingBox())!;
  // The column reaches the bottom of the panel (minus its 14px padding).
  expect(column.y + column.height).toBeCloseTo(list.y + list.height - 14, 0);
  await dashboardColumn(page, "done").locator(".dashboard-card").first().dragTo(dashboardColumn(page, "todo"), {
    targetPosition: { x: column.width / 2, y: column.height - 8 },
  });
  await expect(dashboardColumn(page, "todo").locator(".dashboard-card")).toHaveCount(1);
});
