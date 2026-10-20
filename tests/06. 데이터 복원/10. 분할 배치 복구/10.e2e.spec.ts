import { expect, test } from "@playwright/test";

import { readActiveGroup, restoreWorkspace } from "../../__util__";

test("10. 재방문 시 분할 비율은 중앙으로 초기화하고 탭 배정은 보존한다", async ({
  page,
}) => {
  await restoreWorkspace(page, {
    rightTabIds: ["tab-2"],
    splitRatio: 0.8,
    leftRowRatio: 0.2,
    rightRowRatio: 0.9,
  });
  const group = await readActiveGroup(page);
  expect([group.splitRatio, group.leftRowRatio, group.rightRowRatio]).toEqual([
    0.5, 0.5, 0.5,
  ]);
  expect(group.rightTabIds).toEqual(["tab-2"]);
});
