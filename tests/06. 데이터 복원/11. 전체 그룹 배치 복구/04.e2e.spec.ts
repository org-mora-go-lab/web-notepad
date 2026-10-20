import { expect, test } from "@playwright/test";

import { readStoredState, restoreWorkspace } from "../../__util__";

test("4. 전체 그룹의 중복 분할 배정도 탭을 복제하지 않는다", async ({
  page,
}) => {
  await restoreWorkspace(
    page,
    {},
    {
      allGroupLayout: {
        rightTabIds: ["tab-2", "tab-2"],
        leftBottomTabIds: ["tab-2", "tab-3"],
      },
    },
  );
  const layout = (await readStoredState(page)).allGroupLayout;
  expect(layout?.rightTabIds).toEqual(["tab-2"]);
  expect(layout?.leftBottomTabIds).toEqual(["tab-3"]);
});
