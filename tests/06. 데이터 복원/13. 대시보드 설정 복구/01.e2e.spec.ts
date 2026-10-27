import { expect, test } from "@playwright/test";

import { createTabFixture } from "../../__fixture__";
import {
  dashboardColumn,
  openPanel,
  readActiveGroup,
  restoreWorkspace,
} from "../../__util__";

test("1. 구버전의 일반 상태 문자열은 기존 색상 분류로 복원한다", async ({
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
  expect((await readActiveGroup(page)).tabs[0].dashboardStatus).toBe(
    "in-progress",
  );
  await openPanel(page, "dashboard-panel");
  await expect(
    dashboardColumn(page, "in-progress").locator(".dashboard-card"),
  ).toContainText("Derived Doing");
});
