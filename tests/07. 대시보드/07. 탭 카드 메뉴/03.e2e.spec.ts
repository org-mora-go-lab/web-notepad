import { expect, test } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../../__fixture__";
import { dashboardColumn, openPanel, writeStoredState } from "../../__util__";

test("3. PC에서 열린 탭 카드 메뉴로 다른 그룹에 이동한다", async ({ page }) => {
  await writeStoredState(page, {
    activeGroupId: "source",
    groups: [
      createGroupFixture("source", "Source", [createTabFixture("source-tab", "Alpha task", { tabColor: "gray" })]),
      createGroupFixture("work", "Work", [createTabFixture("work-tab", "Work task")]),
    ],
  });
  await openPanel(page, "dashboard-panel");
  const card = dashboardColumn(page, "todo").locator(".dashboard-card", {
    hasText: "Alpha task",
  });

  await card.click({ button: "right" });
  await page.getByRole("menuitem", { name: "Move Group", exact: true }).click();
  await expect(page.getByRole("menuitem", { name: "Ungrouped", exact: true })).toHaveCount(0);
  await page.getByRole("menuitem", { name: "Work", exact: true }).click();

  await expect(card).toHaveCount(0);
});
