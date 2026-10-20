import { expect, test } from "@playwright/test";

import { dashboardColumn, openPanel, restoreWorkspace } from "../../__util__";

test("3. 상태 표시명이 배열로 손상되면 기본 상태명을 사용한다", async ({
  page,
}) => {
  await restoreWorkspace(page, { dashboardStatusNames: ["wrong"] });
  await openPanel(page, "dashboard-panel");
  await expect(
    dashboardColumn(page, "todo").locator(".dashboard-column-status"),
  ).toContainText("To Do");
});
