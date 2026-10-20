import { expect, test } from "@playwright/test";

import { createTabFixture } from "../../__fixture__";
import { readActiveGroup, restoreWorkspace } from "../../__util__";

test("10. 그룹의 모든 탭이 닫혔으면 기존 데이터를 지우지 않고 새 편집 탭을 만든다", async ({
  page,
}) => {
  await restoreWorkspace(page, {
    tabs: [
      createTabFixture("tab-1", "Kept closed", {
        open: false,
        dashboardStatus: "icebox",
      }),
    ],
  });
  const group = await readActiveGroup(page);
  expect(group.tabs.find((tab) => tab.id === "tab-1")).toMatchObject({
    content: "Kept closed",
    open: false,
    dashboardStatus: "icebox",
  });
  expect(group.tabs.filter((tab) => tab.open)).toHaveLength(1);
  await expect(page.locator("textarea")).toHaveValue("");
});
