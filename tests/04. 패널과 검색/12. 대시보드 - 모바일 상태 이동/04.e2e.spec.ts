import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../../__constant__";
import { openPanel } from "../../__util__";
import { dashboardColumn, seedDashboardTabs } from "../__util__";

test.use({ hasTouch: true, isMobile: true, viewport: MOBILE_VIEWPORT });

test("4. 모바일 상태 버튼으로 닫은 탭을 Todo로 정확히 한 번 복원한다", async ({ page }) => {
  await seedDashboardTabs(page);
  await openPanel(page, "dashboard-panel");
  const card = (status: "todo" | "done") => dashboardColumn(page, status).locator(".dashboard-card", { hasText: "Alpha task" });
  await card("todo").getByRole("button", { name: "Closed", exact: true }).click();
  await expect(card("done")).toHaveAttribute("data-tab-color", "purple");

  await card("done").getByRole("button", { name: "Todo", exact: true }).click();
  await expect(card("todo")).toHaveAttribute("data-tab-color", "gray");
  await expect(card("todo")).toHaveCount(1);
  await expect(page.locator(".tab-item", { hasText: "Alpha task" })).toHaveCount(1);
});
