import { expect, test } from "@playwright/test";

import { openPanel } from "../../__util__";
import { dashboardColumn, dashboardPanel, seedDashboardTabs } from "./__util__";

test("19. 컬럼은 패널 하단까지 이어져 제목 아래 하단에 드롭해도 상태를 변경한다", async ({ page }) => {
  await seedDashboardTabs(page);
  await openPanel(page, "dashboard-panel");
  await dashboardColumn(page, "todo").locator(".dashboard-card").dragTo(dashboardColumn(page, "done"));
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
