import { expect, test } from "@playwright/test";

import { openPanel } from "../../__util__";
import { dashboardColumn, seedDashboardTabs } from "../__util__";

test("4. 상태 제목 아래의 컬럼 하단에 카드를 놓아도 해당 컬럼으로 이동한다", async ({ page }) => {
  await seedDashboardTabs(page);
  await openPanel(page, "dashboard-panel");

  const target = dashboardColumn(page, "todo");
  const column = (await target.boundingBox())!;
  await dashboardColumn(page, "in-progress")
    .locator(".dashboard-card", { hasText: "Beta task" })
    .dragTo(target, {
      targetPosition: { x: column.width / 2, y: column.height - 8 },
    });

  await expect(target.locator(".dashboard-card", { hasText: "Beta task" })).toHaveCount(1);
});
