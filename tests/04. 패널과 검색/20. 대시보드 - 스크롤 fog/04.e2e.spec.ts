import { expect, test } from "@playwright/test";

import { dashboardPanel, seedScrollableDashboard } from "../__util__";

test("4. fog는 목록을 스크롤하면 표시하고 맨 위로 돌아오면 제거된다", async ({ page }) => {
  await seedScrollableDashboard(page);
  const panel = dashboardPanel(page);
  const list = panel.locator(".dashboard-list");
  const statuses = panel.locator(".dashboard-statuses");
  const opacity = () =>
    statuses.evaluate(
      (element) => getComputedStyle(element, "::after").opacity,
    );

  await expect.poll(opacity).toBe("0");
  await list.evaluate((element) => {
    element.scrollTop = 100;
  });
  await expect.poll(opacity).toBe("1");
  await list.evaluate((element) => {
    element.scrollTop = 0;
  });
  await expect.poll(opacity).toBe("0");
});
