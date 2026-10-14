import { expect, test } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../../__fixture__";
import { openPanel, readStoredState, writeStoredState } from "../../__util__";
import { dashboardColumn } from "../__util__";

test("4. 짧은 일반 탭을 Closed로 옮기면 확인 없이 닫은 탭에 보관한다", async ({ page }) => {
  const tab = createTabFixture("tab-short", "short", { tabColor: "gray" });
  await writeStoredState(page, { groups: [createGroupFixture("ungrouped", "Ungrouped", [tab])], activeGroupId: "ungrouped" });
  await openPanel(page, "dashboard-panel");
  await dashboardColumn(page, "todo").locator(".dashboard-card").dragTo(dashboardColumn(page, "done"));

  await expect(page.getByRole("alertdialog")).toHaveCount(0);
  expect((await readStoredState(page)).closedTabs?.[0].tab).toMatchObject({
    content: "short",
    bookmarked: false,
  });
  await expect(page.locator(".tab-item", { hasText: "short" })).toHaveCount(0);
});
