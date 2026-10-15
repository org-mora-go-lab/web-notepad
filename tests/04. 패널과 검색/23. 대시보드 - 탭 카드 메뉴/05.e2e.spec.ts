import { expect, test } from "@playwright/test";

import { createClosedTabFixture, createGroupFixture, createTabFixture } from "../../__fixture__";
import { openPanel, readStoredState, writeStoredState } from "../../__util__";
import { dashboardColumn } from "../__util__";

test("5. Closed의 닫힌 탭 카드 메뉴로 그룹을 옮겨도 닫힌 상태를 유지한다", async ({ page }) => {
  await writeStoredState(page, {
    groups: [
      createGroupFixture("ungrouped", "Ungrouped", [
        createTabFixture("open-1", "Open task"),
      ]),
      createGroupFixture("work", "Work", [
        createTabFixture("open-2", "Work task"),
      ]),
    ],
    closedTabs: [createClosedTabFixture("closed-1", "ungrouped", createTabFixture("tab-1", "Archived task", { tabColor: "purple" }))],
  });
  await openPanel(page, "dashboard-panel");
  const card = dashboardColumn(page, "done").locator(".dashboard-card", {
    hasText: "Archived task",
  });

  await card.click({ button: "right" });
  await page.getByRole("menuitem", { name: "Move Group", exact: true }).click();
  await page.getByRole("menuitem", { name: "Work", exact: true }).click();

  await expect(card).toHaveCount(0);
  const state = await readStoredState(page);
  expect(state.closedTabs).toHaveLength(1);
  expect(state.closedTabs?.[0].groupId).toBe("work");
});
