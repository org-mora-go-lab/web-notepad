import { expect, test } from "@playwright/test";

import { openPanel } from "../../__util__";
import {
  dashboardColumn,
  dashboardPanel,
  seedDashboardTabs,
} from "../../__util__";

test("2. PC에서 드래그로 바꾼 대시보드 상태를 새로고침 후 복원한다", async ({
  page,
}) => {
  await seedDashboardTabs(page);
  await openPanel(page, "dashboard-panel");
  const card = () =>
    dashboardPanel(page)
      .locator(".dashboard-card")
      .filter({ hasText: "Alpha task" });
  await card().dragTo(dashboardColumn(page, "in-progress"));
  await page.reload();
  await expect(dashboardColumn(page, "in-progress")).toContainText(
    "Alpha task",
  );
  await expect(card()).toHaveAttribute("data-tab-color", "indigo");
});
