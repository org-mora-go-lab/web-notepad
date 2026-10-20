import { expect, test } from "@playwright/test";

import { createTabFixture } from "../../__fixture__";
import {
  dashboardColumn,
  openPanel,
  readActiveGroup,
  restoreWorkspace,
} from "../../__util__";

test("1. 보조 상태가 아닌 저장 상태 문자열은 탭 색상으로 다시 판정한다", async ({
  page,
}) => {
  await restoreWorkspace(page, {
    tabs: [
      createTabFixture("tab-1", "Derived Doing", {
        tabColor: "indigo",
        dashboardStatus: "todo",
      }),
    ],
  });
  expect((await readActiveGroup(page)).tabs[0].dashboardStatus).toBeUndefined();
  await openPanel(page, "dashboard-panel");
  await expect(
    dashboardColumn(page, "in-progress").locator(".dashboard-card"),
  ).toContainText("Derived Doing");
});
