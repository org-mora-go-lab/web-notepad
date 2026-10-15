import { expect, test } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../../__fixture__";
import { openPanel, readStoredState, writeStoredState } from "../../__util__";
import { dashboardColumn } from "../__util__";

test("6. 대시보드의 열린 Done 탭 메뉴에서 Closed로 이동한다", async ({ page }) => {
  await writeStoredState(page, {
    activeGroupId: "ungrouped",
    groups: [
      createGroupFixture("ungrouped", "Ungrouped", [
        createTabFixture("tab-1", "Done task", { tabColor: "purple" }),
      ]),
    ],
    nextTabNumber: 2,
  });
  await openPanel(page, "dashboard-panel");
  await dashboardColumn(page, "done")
    .locator(".dashboard-card", { hasText: "Done task" })
    .click({ button: "right" });

  await page.getByRole("menuitem", { name: "Closed", exact: true }).click();
  await expect(
    dashboardColumn(page, "done").locator(".dashboard-card", {
      hasText: "Done task",
    }),
  ).toHaveCount(1);
  const state = await readStoredState(page);
  expect(state.groups[0].tabs.some((tab) => tab.id === "tab-1")).toBe(false);
  expect(state.closedTabs?.[0].tab.id).toBe("tab-1");
});
