import { expect, test } from "@playwright/test";

import { readActiveGroup, restoreWorkspace } from "../../__util__";

test("5. 오른쪽 상단이 비면 오른쪽 하단 노트를 상단으로 승격한다", async ({
  page,
}) => {
  await restoreWorkspace(page, {
    rightBottomTabIds: ["tab-2"],
    activeRightBottomTabId: "tab-2",
    activePane: "right-bottom",
  });
  const group = await readActiveGroup(page);
  expect(group.rightTabIds).toEqual(["tab-2"]);
  expect(group.rightBottomTabIds).toEqual([]);
  expect(group.activePane).toBe("right");
});
