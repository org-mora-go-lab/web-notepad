import { expect, test } from "@playwright/test";

import { readActiveGroup, restoreWorkspace } from "../../__util__";

test("8. 빈 하단 분할을 활성 영역으로 저장했으면 존재하는 상단으로 포커스를 복구한다", async ({
  page,
}) => {
  await restoreWorkspace(page, {
    rightTabIds: ["tab-2"],
    activePane: "right-bottom",
    activeRightBottomTabId: "missing",
  });
  const group = await readActiveGroup(page);
  expect(group.activePane).toBe("right");
  expect(group.activeRightBottomTabId).toBeNull();
});
