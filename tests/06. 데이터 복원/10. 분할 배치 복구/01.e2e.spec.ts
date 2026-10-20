import { expect, test } from "@playwright/test";

import { readActiveGroup, restoreWorkspace } from "../../__util__";

test("1. 존재하지 않는 분할 탭 ID를 제거하고 유효한 노트는 유지한다", async ({
  page,
}) => {
  await restoreWorkspace(page, {
    rightTabIds: ["missing", "tab-2"],
    activeRightTabId: "tab-2",
  });
  expect((await readActiveGroup(page)).rightTabIds).toEqual(["tab-2"]);
  await expect(page.locator("textarea")).toHaveCount(2);
});
