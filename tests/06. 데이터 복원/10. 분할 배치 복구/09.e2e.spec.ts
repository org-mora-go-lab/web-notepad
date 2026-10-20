import { expect, test } from "@playwright/test";

import { readActiveGroup, restoreWorkspace } from "../../__util__";

test("9. 배열이 아닌 분할 목록은 무시하고 노트 전체를 기본 영역에 보존한다", async ({
  page,
}) => {
  await restoreWorkspace(page, {
    rightTabIds: "tab-2",
    leftBottomTabIds: {},
    rightBottomTabIds: 42,
  });
  const group = await readActiveGroup(page);
  expect([
    group.rightTabIds,
    group.leftBottomTabIds,
    group.rightBottomTabIds,
  ]).toEqual([[], [], []]);
  await expect(page.getByRole("tab")).toHaveCount(3);
});
