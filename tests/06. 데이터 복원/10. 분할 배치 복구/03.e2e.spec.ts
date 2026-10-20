import { expect, test } from "@playwright/test";

import { readActiveGroup, restoreWorkspace } from "../../__util__";

test("3. 하나의 탭이 여러 분할에 중복 배정되면 한 분할에서만 연다", async ({
  page,
}) => {
  await restoreWorkspace(page, {
    rightTabIds: ["tab-2", "tab-2"],
    leftBottomTabIds: ["tab-2", "tab-3"],
    rightBottomTabIds: ["tab-2", "tab-3"],
  });
  const group = await readActiveGroup(page);
  expect(group.rightTabIds).toEqual(["tab-2"]);
  expect(group.leftBottomTabIds).toEqual(["tab-3"]);
  expect(group.rightBottomTabIds).toEqual([]);
  await expect(page.getByRole("tab")).toHaveCount(3);
});
