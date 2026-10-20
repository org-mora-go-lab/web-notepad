import { expect, test } from "@playwright/test";

import { readStoredState, restoreWorkspace } from "../../__util__";

test("6. 전체 그룹의 빈 왼쪽 열은 오른쪽 노트를 승격해 복구한다", async ({
  page,
}) => {
  await restoreWorkspace(
    page,
    {},
    {
      allGroupLayout: {
        rightTabIds: ["tab-1", "tab-2", "tab-3"],
        activeRightTabId: "tab-2",
        activePane: "right",
      },
    },
  );
  const layout = (await readStoredState(page)).allGroupLayout;
  expect(layout?.rightTabIds).toEqual([]);
  expect(layout?.activeTabId).toBe("tab-2");
  expect(layout?.activePane).toBe("left");
});
