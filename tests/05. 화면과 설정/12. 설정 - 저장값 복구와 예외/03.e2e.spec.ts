import { expect, test } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../../__fixture__";
import { activeTabItem, writeStoredState } from "../../__util__";

test("3. 설정 순서에 없는 색상 탭의 색상 아이콘을 누르면 첫 번째 색상으로 바꾼다", async ({ page }) => {
  await writeStoredState(page, {
    activeGroupId: "ungrouped",
    groups: [createGroupFixture("ungrouped", "Ungrouped", [
      createTabFixture("tab-red", "Out of cycle", { tabColor: "red" }),
    ])],
  });
  const tab = activeTabItem(page);
  await expect(tab).toHaveAttribute("data-tab-color", "red");
  await tab.locator(".dirty-dot").click();
  await expect(tab).toHaveAttribute("data-tab-color", "gray");
});
