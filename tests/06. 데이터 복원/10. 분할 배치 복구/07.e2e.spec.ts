import { expect, test } from "@playwright/test";

import { readActiveGroup, restoreWorkspace } from "../../__util__";

test("7. 다른 분할의 탭을 가리키는 활성 ID는 해당 분할 첫 탭으로 복구한다", async ({
  page,
}) => {
  await restoreWorkspace(page, {
    rightTabIds: ["tab-2"],
    activeTabId: "tab-2",
    activeRightTabId: "tab-1",
  });
  const group = await readActiveGroup(page);
  expect(group.activeTabId).toBe("tab-1");
  expect(group.activeRightTabId).toBe("tab-2");
});
