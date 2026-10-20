import { expect, test } from "@playwright/test";

import { readStoredState, restoreWorkspace, switchGroup } from "../../__util__";

test("1. 전체 그룹에 저장된 유효한 분할은 개별 그룹 배치와 독립적으로 복원한다", async ({
  page,
}) => {
  await restoreWorkspace(
    page,
    {},
    {
      allGroupLayout: {
        rightTabIds: ["tab-2"],
        activeRightTabId: "tab-2",
        activeTabId: "tab-1",
        activePane: "right",
      },
    },
  );
  const state = await readStoredState(page);
  expect(state.allGroupLayout?.rightTabIds).toEqual(["tab-2"]);
  expect(state.groups[0].rightTabIds).toEqual([]);
  await switchGroup(page, "All Group");
  await expect(page.locator("textarea")).toHaveCount(2);
});
