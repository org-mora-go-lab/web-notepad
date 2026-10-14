import { expect, test } from "@playwright/test";

import { openPanel } from "../../__util__";
import { dashboardColumn, seedDashboardTabs } from "../__util__";

test("3. 카드 미리보기는 3줄로 제한한다", async ({ page }) => {
  await seedDashboardTabs(page);
  await openPanel(page, "dashboard-panel");

  await expect(
    dashboardColumn(page, "todo").locator(".dashboard-card-preview"),
  ).toHaveCSS("-webkit-line-clamp", "3");
});
