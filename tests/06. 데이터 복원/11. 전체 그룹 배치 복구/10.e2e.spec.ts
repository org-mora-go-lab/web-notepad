import { expect, test } from "@playwright/test";

import { readStoredState, restoreWorkspace } from "../../__util__";

test("10. 전체 그룹의 잘못된 분할 목록과 활성 값은 안전한 기본값으로 복구한다", async ({
  page,
}) => {
  await restoreWorkspace(
    page,
    {},
    {
      allGroupLayout: {
        rightTabIds: 42,
        leftBottomTabIds: "tab-2",
        rightBottomTabIds: null,
        activeRightTabId: {},
        activeTabId: [],
      },
    },
  );
  const layout = (await readStoredState(page)).allGroupLayout;
  expect([
    layout?.rightTabIds,
    layout?.leftBottomTabIds,
    layout?.rightBottomTabIds,
  ]).toEqual([[], [], []]);
  expect(layout?.activeTabId).toBe("tab-1");
});
