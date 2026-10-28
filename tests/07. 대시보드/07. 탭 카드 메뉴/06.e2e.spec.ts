import { expect, test } from "@playwright/test";

import { dashboardColumn, openPanel, seedDashboardTabs } from "../../__util__";

test("6. 전체화면 대시보드의 Done 카드 우클릭 메뉴로 북마크를 전환한다", async ({
  page,
}) => {
  await seedDashboardTabs(page);
  await openPanel(page, "dashboard-panel");
  await page.locator(".dashboard-expand").click();
  const card = dashboardColumn(page, "done").locator(".dashboard-card", {
    hasText: "Gamma task",
  });
  await card.click({ button: "right" });
  await expect(page.getByRole("menuitem")).toHaveText([
    "Move Group",
    "Bookmark",
  ]);
  await page.getByRole("menuitem", { name: "Bookmark", exact: true }).click();
  await expect(card.getByRole("img", { name: "Bookmarked" })).toBeVisible();
});
