import { expect, test } from "@playwright/test";

import { dashboardColumn, openPanel, seedDashboardTabs } from "../../__util__";

test("5. Doing 카드 메뉴에는 Done 이동 바로가기가 없다", async ({ page }) => {
  await seedDashboardTabs(page);
  await openPanel(page, "dashboard-panel");
  const card = dashboardColumn(page, "in-progress").locator(".dashboard-card", {
    hasText: "Beta task",
  });
  await card.click({ button: "right" });

  await expect(
    page.getByRole("menu").getByRole("menuitem", {
      name: "Move to Done",
      exact: true,
    }),
  ).toHaveCount(0);
});
