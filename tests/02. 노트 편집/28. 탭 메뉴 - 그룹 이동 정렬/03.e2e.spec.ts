import { expect, test } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../../__fixture__";
import { activeTab, openTabMenu, writeStoredState } from "../../__util__";

test("3. 그룹 이동 대상의 Ungrouped는 목록 맨 아래에 배치한다", async ({ page }) => {
  await writeStoredState(page, {
    activeGroupId: "source",
    groups: [
      createGroupFixture("ungrouped", "Ungrouped", [createTabFixture("u-tab", "ungrouped")]),
      createGroupFixture("source", "Source", [createTabFixture("source-tab", "source")]),
      createGroupFixture("alpha", "Alpha", [createTabFixture("alpha-tab", "alpha")]),
    ],
  });
  await openTabMenu(activeTab(page));
  await page.getByRole("menuitem", { name: "Move Group", exact: true }).click();
  await expect(page.locator(".move-group-option")).toHaveText(["Alpha", "Ungrouped"]);
});
