import { expect, test } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../../__fixture__";
import { openPanel, readStoredState, writeStoredState } from "../../__util__";
import { dashboardColumn } from "../__util__";

test("7. 고정 탭의 Done 상태는 새로고침 후에도 유지한다", async ({ page }) => {
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
  await page.reload();
  await expect(page.locator("#dashboard-panel")).toHaveAttribute("aria-hidden", "false");

  await expect(dashboardColumn(page, "done")).toContainText("Pinned task");
  await expect(page.locator(".tab-item", { hasText: "Pinned task" })).toHaveCount(1);
  expect((await readStoredState(page)).groups[0].tabs.find((tab) => tab.id === "tab-1")).toMatchObject({ pinned: true, tabColor: "purple" });
});
