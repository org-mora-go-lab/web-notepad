import { expect, test } from "@playwright/test";

import { openPanel } from "../../__util__";
import { dashboardColumn, seedDashboardTabs } from "../__util__";

test("8. PC 대시보드 탭 카드에 hover해도 기본 포인터를 표시하고 드래그를 유지한다", async ({ page }) => {
  await seedDashboardTabs(page);
  await openPanel(page, "dashboard-panel");
  const card = dashboardColumn(page, "todo").locator(".dashboard-card", {
    hasText: "Alpha task",
  });

  await card.hover();

  await expect(card).toHaveCSS("cursor", "default");
  await expect(card).toHaveAttribute("draggable", "true");
});
