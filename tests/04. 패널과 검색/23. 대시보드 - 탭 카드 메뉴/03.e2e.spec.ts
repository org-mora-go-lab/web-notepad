import { expect, test } from "@playwright/test";

import { openPanel } from "../../__util__";
import { dashboardColumn, seedDashboardTabs } from "../__util__";

test("3. PC에서 열린 탭 카드 메뉴로 다른 그룹에 이동한다", async ({ page }) => {
  await seedDashboardTabs(page);
  await openPanel(page, "dashboard-panel");
  const card = dashboardColumn(page, "todo").locator(".dashboard-card", {
    hasText: "Alpha task",
  });

  await card.click({ button: "right" });
  await page.getByRole("menuitem", { name: "Move Group", exact: true }).click();
  await page.getByRole("menuitem", { name: "Work", exact: true }).click();

  await expect(card).toHaveCount(0);
});
