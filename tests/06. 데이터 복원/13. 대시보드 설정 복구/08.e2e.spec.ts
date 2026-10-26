import { expect, test } from "@playwright/test";

import { readStoredState, restoreWorkspace } from "../../__util__";

test("8. 전체 그룹과 개별 그룹의 보조 상태 표시 설정을 별도로 복구한다", async ({
  page,
}) => {
  await restoreWorkspace(
    page,
    { dashboardVisibility: { icebox: true, done: false } },
    { allGroupDashboardVisibility: { icebox: false, done: true } },
  );
  const state = await readStoredState(page);
  expect(state.groups[0].dashboardVisibility).toEqual({
    icebox: true,
    done: false,
  });
  expect(state.allGroupDashboardVisibility).toEqual({
    icebox: false,
    done: true,
  });
});
