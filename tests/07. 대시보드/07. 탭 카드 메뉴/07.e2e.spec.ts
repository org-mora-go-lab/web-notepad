import { expect, test } from "@playwright/test";

import {
  dashboardColumn,
  openPanel,
  readStoredState,
  seedDashboardTabs,
} from "../../__util__";

test("7. 전체화면 대시보드의 Done 카드도 상태와 본문을 유지하며 다른 그룹으로 이동한다", async ({
  page,
}) => {
  await seedDashboardTabs(page);
  await openPanel(page, "dashboard-panel");
  await page.locator(".dashboard-expand").click();
  const card = dashboardColumn(page, "done").locator(".dashboard-card", {
    hasText: "Gamma task",
  });
  await card.click({ button: "right" });
  await page.getByRole("menuitem", { name: "Move Group", exact: true }).click();
  await page.getByRole("menuitem", { name: "Work", exact: true }).click();
  await expect(card).toHaveCount(0);
  const state = await readStoredState(page);
  const moved = state.groups
    .find((group) => group.id === "work")!
    .tabs.find((tab) => tab.id === "tab-3")!;
  expect(moved.content).toBe("Gamma task");
  expect(moved.dashboardStatus).toBe("done");
});
