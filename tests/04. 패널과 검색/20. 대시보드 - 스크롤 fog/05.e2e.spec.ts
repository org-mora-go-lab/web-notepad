import { expect, test } from "@playwright/test";

import { dashboardPanel, seedScrollableDashboard } from "../__util__";

test("5. fog 표시와 제거에는 180ms 전환을 적용한다", async ({ page }) => {
  await seedScrollableDashboard(page);
  const statuses = dashboardPanel(page).locator(".dashboard-statuses");

  await expect
    .poll(() =>
      statuses.evaluate(
        (element) => getComputedStyle(element, "::after").transitionDuration,
      ),
    )
    .toBe("0.18s");
});
