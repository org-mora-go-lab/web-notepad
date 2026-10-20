import { expect, test } from "@playwright/test";

import { readStoredState, restoreWorkspace } from "../../__util__";

test("2. 전체 그룹 분할에서 사라진 원본 탭 ID를 제거한다", async ({ page }) => {
  await restoreWorkspace(
    page,
    {},
    { allGroupLayout: { rightTabIds: ["deleted", "tab-2"] } },
  );
  expect((await readStoredState(page)).allGroupLayout?.rightTabIds).toEqual([
    "tab-2",
  ]);
});
