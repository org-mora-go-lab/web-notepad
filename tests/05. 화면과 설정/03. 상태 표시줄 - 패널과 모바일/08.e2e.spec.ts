import { expect, test } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../../__fixture__";
import { writeStoredState } from "../../__util__";

test("8. 모바일에서 새로고침해도 저장된 현재 그룹 이름을 하단 버튼에 표시한다", async ({ page }) => {
  await writeStoredState(page, {
    activeGroupId: "work",
    groups: [
      createGroupFixture("ungrouped", "Ungrouped", [createTabFixture("tab-1", "")]),
      createGroupFixture("work", "Work", [createTabFixture("tab-2", "Work note")]),
    ],
    nextTabNumber: 3,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  await expect(page.locator(".group-select-name")).toHaveText("Work");
});
