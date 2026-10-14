import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../../__constant__";
import { openPanel } from "../../__util__";
import { dashboardColumn, seedDashboardTabs } from "../__util__";

test.use({ hasTouch: true });

test("4. 모바일에서 열린 탭 카드 더블탭 메뉴로 고정 상태를 전환한다", async ({
  page,
}) => {
  await page.setViewportSize(MOBILE_VIEWPORT);
  await seedDashboardTabs(page);
  await openPanel(page, "dashboard-panel");
  const card = dashboardColumn(page, "todo").locator(".dashboard-card", {
    hasText: "Alpha task",
  });

  await card.locator(".dashboard-card-open").dblclick();
  await page.getByRole("menuitem", { name: "Pin", exact: true }).tap();

  await expect(card.getByRole("img", { name: "Pinned" })).toBeVisible();
});
