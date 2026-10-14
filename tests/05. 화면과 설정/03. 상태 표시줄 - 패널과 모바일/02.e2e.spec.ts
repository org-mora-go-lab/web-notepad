import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../../__constant__";
import { createGroupFixture, createTabFixture } from "../../__fixture__";
import { writeStoredState } from "../../__util__";

test("2. 모바일은 별도 현재 그룹 표시줄 없이 하단 그룹 선택 버튼에 현재 그룹명을 표시한다", async ({
  page,
}) => {
  await page.setViewportSize(MOBILE_VIEWPORT);
  await writeStoredState(page, {
    activeGroupId: "ungrouped",
    groups: [
      createGroupFixture("ungrouped", "Ungrouped", [
        createTabFixture("tab-1", ""),
      ]),
    ],
    nextTabNumber: 2,
  });
  const panel = page.locator(".group-select-command");
  const name = panel.locator(".group-select-name");
  await expect(panel).toBeVisible();
  await expect(name).toHaveText("Ungrouped");
  await expect(panel.locator("svg")).toHaveCount(1);
  await expect(page.locator(".current-group-panel")).toHaveCount(0);
});
