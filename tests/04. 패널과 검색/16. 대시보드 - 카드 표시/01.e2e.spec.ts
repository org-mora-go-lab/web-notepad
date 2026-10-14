import { expect, test } from "@playwright/test";

import { openPanel } from "../../__util__";
import { dashboardColumn, dashboardPanel, seedDashboardTabs } from "../__util__";

test("1. 대시보드 카드와 상태 제목은 상태 색상을 표시한다", async ({ page }) => {
  await seedDashboardTabs(page);
  await openPanel(page, "dashboard-panel");
  const panel = dashboardPanel(page);
  const card = dashboardColumn(page, "todo").locator(".dashboard-card");

  const statusColors = await panel
    .locator(".dashboard-statuses h3")
    .first()
    .evaluate((status) => {
      const sample = document.createElement("span");
      sample.style.backgroundColor =
        "color-mix(in srgb, var(--dashboard-accent) 16%, transparent)";
      status.append(sample);
      const result = {
        actual: getComputedStyle(status).backgroundColor,
        expected: getComputedStyle(sample).backgroundColor,
      };
      sample.remove();
      return result;
    });
  expect(statusColors.actual).toBe(statusColors.expected);
  await expect(card).toHaveAttribute("data-tab-color", "gray");
});
