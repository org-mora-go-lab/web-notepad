import { test } from "@playwright/test";

import { expectSelectedLines, seedStoredStateOnLoad } from "../../__util__";

test("10. 선택 줄 정보가 없는 저장 탭은 선택된 줄이 없는 상태로 복원한다", async ({ page }) => {
  await seedStoredStateOnLoad(page, {
    activeGroupId: "ungrouped",
    groups: [{
      id: "ungrouped",
      name: "Ungrouped",
      activeTabId: "tab-1",
      tabs: [{ id: "tab-1", content: "one\ntwo" }],
    }],
  });
  await expectSelectedLines(page, [false, false]);
});
