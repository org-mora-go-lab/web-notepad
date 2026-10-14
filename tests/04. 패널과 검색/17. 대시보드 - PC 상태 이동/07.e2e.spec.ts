import { expect, test } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../../__fixture__";
import { openPanel, readStoredState, writeStoredState } from "../../__util__";
import { dashboardColumn } from "../__util__";

test("7. 고정 탭의 Closed 이동을 확인하면 고정을 해제하고 닫은 탭에 보관한다", async ({ page }) => {
  await writeStoredState(page, {
    activeGroupId: "ungrouped",
    groups: [
      createGroupFixture("ungrouped", "Ungrouped", [
        createTabFixture("tab-1", "Pinned task", {
          tabColor: "gray",
          pinned: true,
        }),
        createTabFixture("tab-2", "Other task", { tabColor: "gray" }),
      ]),
    ],
    nextTabNumber: 3,
  });
  await openPanel(page, "dashboard-panel");

  await dashboardColumn(page, "todo")
    .locator(".dashboard-card", { hasText: "Pinned task" })
    .dragTo(dashboardColumn(page, "done"));
  await page
    .getByRole("alertdialog")
    .getByRole("button", { name: "Unpin and close" })
    .click();

  await expect(dashboardColumn(page, "done")).toContainText("Pinned task");
  await expect(page.locator(".tab-item", { hasText: "Pinned task" })).toHaveCount(0);
  expect((await readStoredState(page)).closedTabs?.[0].tab.pinned).toBe(false);
});
