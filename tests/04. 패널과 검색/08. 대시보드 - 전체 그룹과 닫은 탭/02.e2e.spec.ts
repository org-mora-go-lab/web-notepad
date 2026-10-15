import { expect, test } from "@playwright/test";

import { groupsCommand, openPanel, readStoredState } from "../../__util__";
import { dashboardColumn, seedDashboardTabs } from "../__util__";

test("2. All에서 카드를 옮기면 해당 탭이 속한 그룹의 상태를 변경한다", async ({ page }) => {
  await seedDashboardTabs(page);
  await groupsCommand(page).click();
  await page.getByRole("button", { name: "All", exact: true }).click();
  await groupsCommand(page).click();
  await openPanel(page, "dashboard-panel");
  await dashboardColumn(page, "todo").locator(".dashboard-card", { hasText: "Work only task" }).dragTo(dashboardColumn(page, "in-progress"));

  const work = (await readStoredState(page)).groups.find((group) => group.id === "work")!;
  expect(work.tabs[0].tabColor).toBe("green");
});
