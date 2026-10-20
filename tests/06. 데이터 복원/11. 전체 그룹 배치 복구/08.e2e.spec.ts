import { expect, test } from "@playwright/test";

import { readStoredState, restoreWorkspace } from "../../__util__";

test("8. 전체 그룹 분할 비율도 재방문 시 중앙으로 복구한다", async ({
  page,
}) => {
  await restoreWorkspace(
    page,
    {},
    {
      allGroupLayout: {
        rightTabIds: ["tab-2"],
        splitRatio: 0.8,
        leftRowRatio: 0.2,
        rightRowRatio: 0.7,
      },
    },
  );
  const layout = (await readStoredState(page)).allGroupLayout;
  expect([
    layout?.splitRatio,
    layout?.leftRowRatio,
    layout?.rightRowRatio,
  ]).toEqual([0.5, 0.5, 0.5]);
});
