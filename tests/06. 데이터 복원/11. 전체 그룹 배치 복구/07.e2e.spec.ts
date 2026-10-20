import { expect, test } from "@playwright/test";

import { readStoredState, restoreWorkspace } from "../../__util__";

test("7. 전체 그룹에 배정되지 않은 활성 ID는 해당 분할의 첫 탭으로 복구한다", async ({
  page,
}) => {
  await restoreWorkspace(
    page,
    {},
    {
      allGroupLayout: {
        activeTabId: "missing",
        rightTabIds: ["tab-2"],
        activeRightTabId: "tab-3",
      },
    },
  );
  const layout = (await readStoredState(page)).allGroupLayout;
  expect(layout?.activeTabId).toBe("tab-1");
  expect(layout?.activeRightTabId).toBe("tab-2");
});
