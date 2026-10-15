import { expect, test } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../../__fixture__";
import { openPanel, writeStoredState } from "../../__util__";
import { dashboardColumn } from "../__util__";

test("6. 고정 탭을 Closed로 옮기면 확인 없이 고정과 열린 상태를 유지한다", async ({ page }) => {
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
  const card = dashboardColumn(page, "todo").locator(".dashboard-card", {
    hasText: "Pinned task",
  });

  await card.dragTo(dashboardColumn(page, "done"));
  await expect(page.getByRole("alertdialog")).toHaveCount(0);
  await expect(page.locator(".tab-item", { hasText: "Pinned task" })).toHaveCount(1);
  await expect(dashboardColumn(page, "done")).toContainText("Pinned task");
  await expect(page.locator(".tab-item", { hasText: "Pinned task" })).toHaveClass(/is-pinned/);
});
