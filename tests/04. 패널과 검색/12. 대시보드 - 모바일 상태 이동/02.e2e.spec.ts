import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../../__constant__";
import { openPanel } from "../../__util__";
import { dashboardColumn, seedDashboardTabs } from "../__util__";

test.use({ hasTouch: true, isMobile: true, viewport: MOBILE_VIEWPORT });

test("2. 모바일 상태 버튼으로 열린 탭을 Todo와 WIP 사이에서 옮기고 색상을 변경한다", async ({ page }) => {
  await seedDashboardTabs(page);
  await openPanel(page, "dashboard-panel");
  const card = (status: "todo" | "in-progress") => dashboardColumn(page, status).locator(".dashboard-card", { hasText: "Alpha task" });

  await card("todo").getByRole("button", { name: "WIP", exact: true }).click();
  await expect(card("in-progress")).toHaveAttribute("data-tab-color", "green");
  await card("in-progress").getByRole("button", { name: "Todo", exact: true }).click();
  await expect(card("todo")).toHaveAttribute("data-tab-color", "gray");
});
