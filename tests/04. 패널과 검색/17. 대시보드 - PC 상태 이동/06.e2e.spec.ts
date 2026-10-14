import { expect, test } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../../__fixture__";
import { openPanel, writeStoredState } from "../../__util__";
import { dashboardColumn } from "../__util__";

test("6. 고정 탭의 Closed 이동 확인을 취소하면 탭과 카드를 유지한다", async ({ page }) => {
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
  const popup = page.getByRole("alertdialog");
  await expect(popup).toBeVisible();
  await popup.getByRole("button", { name: "Cancel" }).click();

  await expect(page.locator(".tab-item", { hasText: "Pinned task" })).toHaveCount(1);
  await expect(dashboardColumn(page, "todo")).toContainText("Pinned task");
  await expect(dashboardColumn(page, "done")).not.toContainText("Pinned task");
});
