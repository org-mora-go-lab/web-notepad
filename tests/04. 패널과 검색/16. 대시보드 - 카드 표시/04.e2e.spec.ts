import { expect, test } from "@playwright/test";

import { openPanel } from "../../__util__";
import { dashboardColumn, dashboardPanel, seedDashboardTabs } from "../__util__";

test("4. 대시보드 상태·카드·미리보기·개수를 지정한 글자 크기로 표시한다", async ({ page }) => {
  await seedDashboardTabs(page);
  await openPanel(page, "dashboard-panel");
  const panel = dashboardPanel(page);
  const card = dashboardColumn(page, "todo").locator(".dashboard-card");

  await expect(panel.locator(".dashboard-statuses h3").first()).toHaveCSS(
    "font-size",
    "16.8px",
  );
  await expect(card.locator("strong")).toHaveCSS("font-size", "16.8px");
  await expect(card.locator(".dashboard-card-preview")).toHaveCSS(
    "font-size",
    "15.6px",
  );
  await expect(panel.locator(".dashboard-count").first()).toHaveCSS(
    "font-size",
    "14.4px",
  );
});
