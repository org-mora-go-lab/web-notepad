import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../../__constant__";
import { openPanel } from "../../__util__";
import { dashboardColumn, dashboardPanel, seedDashboardTabs } from "../__util__";

test.use({ hasTouch: true, isMobile: true, viewport: MOBILE_VIEWPORT });

test("6. 모바일에서 변경한 Closed 상태를 새로고침 후에도 유지한다", async ({ page }) => {
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

  await page.reload();

  await expect(dashboardPanel(page)).toHaveAttribute("aria-hidden", "false");
  await expect(card("in-progress")).toHaveAttribute("data-tab-color", "green");
  await expect(card("in-progress")).toHaveCount(1);
});
