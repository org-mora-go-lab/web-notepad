import { expect, test } from "@playwright/test";

import { openPanel } from "../../__util__";
import { dashboardColumn, seedDashboardTabs } from "../__util__";

test("2. 카드 제목은 2줄로 제한하고 전체 제목을 title로 제공한다", async ({ page }) => {
  await seedDashboardTabs(page);
  await openPanel(page, "dashboard-panel");
  const title = dashboardColumn(page, "todo")
    .locator(".dashboard-card")
    .locator("strong");

  await expect(title).toHaveCSS("-webkit-line-clamp", "2");
  await expect(title).toHaveAttribute("title", "Alpha task");
});
