import { expect, test } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../../__fixture__";
import { openPanel, writeStoredState } from "../../__util__";
import { dashboardColumn } from "../__util__";

test("10. 현재 색상 순서에 없는 색상의 탭은 Todo 컬럼에 표시한다", async ({
  page,
}) => {
  await writeStoredState(page, {
    activeGroupId: "ungrouped",
    groups: [
      createGroupFixture("ungrouped", "Ungrouped", [
        createTabFixture("tab-red", "Unmapped red task", {
          tabColor: "red",
        }),
      ]),
    ],
  });
  await openPanel(page, "dashboard-panel");

  await expect(
    dashboardColumn(page, "todo").locator(".dashboard-card"),
  ).toContainText("Unmapped red task");
  await expect(
    dashboardColumn(page, "in-progress").locator(".dashboard-card"),
  ).toHaveCount(0);
  await expect(
    dashboardColumn(page, "done").locator(".dashboard-card"),
  ).toHaveCount(0);
});
