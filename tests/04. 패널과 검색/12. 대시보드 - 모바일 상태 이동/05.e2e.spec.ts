import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../../__constant__";
import { openPanel } from "../../__util__";
import { dashboardColumn, seedDashboardTabs } from "../__util__";

test.use({ hasTouch: true, isMobile: true, viewport: MOBILE_VIEWPORT });

test("5. 모바일 상태 버튼으로 닫은 탭을 WIP으로 정확히 한 번 복원한다", async ({ page }) => {
  await seedDashboardTabs(page);
  await openPanel(page, "dashboard-panel");
  const card = (status: "todo" | "in-progress" | "done") =>
    dashboardColumn(page, status).locator(".dashboard-card", {
      hasText: "Alpha task",
    });
  await card("todo")
    .getByRole("button", { name: "Closed", exact: true })
    .click();

  await card("done").getByRole("button", { name: "WIP", exact: true }).click();

  await expect(card("in-progress")).toHaveAttribute("data-tab-color", "green");
  await expect(card("in-progress")).toHaveCount(1);
  await expect(page.locator(".tab-item", { hasText: "Alpha task" })).toHaveCount(1);
});
