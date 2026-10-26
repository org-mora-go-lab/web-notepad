import { expect, test } from "@playwright/test";

import { openPanel } from "../../__util__";
import { dashboardColumn, seedDashboardTabs } from "../../__util__";

test("1. PC에서 열린 탭 카드 메뉴로 북마크 상태를 전환한다", async ({
  page,
}) => {
  await seedDashboardTabs(page);
  await openPanel(page, "dashboard-panel");
  const card = dashboardColumn(page, "todo").locator(".dashboard-card", {
    hasText: "Alpha task",
  });

  await card.click({ button: "right" });
  await expect(page.getByRole("menu").getByRole("menuitem")).toHaveText(["Move Group", "Bookmark", "Move to Note"]);
  await expect(page.locator(".tab-context-menu-footer")).toHaveCount(1);
  await page.getByRole("menuitem", { name: "Bookmark", exact: true }).click();

  await expect(card.getByRole("img", { name: "Bookmarked" })).toBeVisible();
});
