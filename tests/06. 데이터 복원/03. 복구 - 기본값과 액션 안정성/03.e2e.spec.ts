import { expect, test } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../../__fixture__";
import { createGroup, groupsCommand, seedStoredStateOnLoad } from "../../__util__";

test("3. 손상된 액션 이름 필드를 제거한 뒤에도 그룹 생성이 동작한다", async ({ page }) => {
  await seedStoredStateOnLoad(page, {
    activeGroupId: "ungrouped",
    groups: [createGroupFixture("ungrouped", "Ungrouped", [createTabFixture("tab-1", "Protected note")])],
    createGroup: { corrupted: true },
  });
  await groupsCommand(page).click();
  await createGroup(page, "Recovered actions");
  await expect(page.locator(".group-select-name")).toHaveText("Recovered actions");
});
