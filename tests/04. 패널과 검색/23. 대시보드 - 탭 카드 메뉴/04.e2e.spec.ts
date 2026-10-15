import { expect, test } from "@playwright/test";

import { createClosedTabFixture, createGroupFixture, createTabFixture } from "../../__fixture__";
import { openPanel, readStoredState, writeStoredState } from "../../__util__";
import { dashboardColumn } from "../__util__";

test("4. Done의 닫힌 탭 카드 메뉴로 북마크해도 닫힌 상태를 유지한다", async ({ page }) => {
  await writeStoredState(page, {
    groups: [
      createGroupFixture("ungrouped", "Ungrouped", [
        createTabFixture("open-1", "Open task"),
      ]),
    ],
    closedTabs: [createClosedTabFixture("closed-1", "ungrouped", createTabFixture("tab-1", "Archived task", { tabColor: "purple" }))],
  });
  await openPanel(page, "dashboard-panel");
  const card = dashboardColumn(page, "done").locator(".dashboard-card", {
    hasText: "Archived task",
  });

  await card.click({ button: "right" });
  await page.getByRole("menuitem", { name: "Bookmark", exact: true }).click();

  await expect(card.getByRole("img", { name: "Bookmarked" })).toBeVisible();
  expect((await readStoredState(page)).closedTabs).toHaveLength(1);
});
