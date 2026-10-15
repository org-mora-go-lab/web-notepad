import { expect, test } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../../__fixture__";
import { switchGroup, writeStoredState } from "../../__util__";

test("3. 모바일에서 그룹을 전환하면 별도 그룹 이름 영역과 접근성 라벨을 즉시 동기화한다", async ({ page }) => {
  await writeStoredState(page, {
    activeGroupId: "ungrouped",
    groups: [
      createGroupFixture("ungrouped", "Ungrouped", [createTabFixture("tab-1", "")]),
      createGroupFixture("work", "Work", [createTabFixture("tab-2", "Work note")]),
    ],
    nextTabNumber: 3,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  const command = page.locator(".group-select-command");
  await switchGroup(page, "Work");
  await expect(page.locator(".current-group-name")).toHaveText("Work");
  await expect(command).toHaveAttribute("aria-label", "Select group: Work");
});
