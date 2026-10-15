import { expect, test } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../../__fixture__";
import { openPanel, writeStoredState } from "../../__util__";
import { dashboardColumn } from "../__util__";

test("4. Done 카드 메뉴는 Bookmark 바로 아래에 Closed를 표시한다", async ({ page }) => {
  await writeStoredState(page, {
    activeGroupId: "ungrouped",
    groups: [
      createGroupFixture("ungrouped", "Ungrouped", [
        createTabFixture("tab-1", "Done task", { tabColor: "purple" }),
      ]),
      createGroupFixture("work", "Work", [createTabFixture("tab-2", "Work task")]),
    ],
    nextTabNumber: 3,
  });
  await openPanel(page, "dashboard-panel");
  await dashboardColumn(page, "done")
    .locator(".dashboard-card", { hasText: "Done task" })
    .click({ button: "right" });

  await expect(page.getByRole("menu").getByRole("menuitem")).toHaveText([
    "Bookmark",
    "Closed",
    "Move Group",
  ]);
});
