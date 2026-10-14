import { expect, test } from "@playwright/test";

import { createClosedTabFixture, createGroupFixture, createTabFixture } from "../../__fixture__";
import { chooseTabMenuItem, closeActiveTab, openClosedPanel, readStoredState, restoreFirstClosedTab, writeStoredState } from "../../__util__";

test("7. 복원 후 수정하지 않은 북마크 탭도 확인 없이 닫고 Closed에 다시 보관한다", async ({ page }) => {
  const group = createGroupFixture("ungrouped", "Ungrouped", [createTabFixture("tab-1", "")]);
  await writeStoredState(page, {
    groups: [group], activeGroupId: group.id, nextTabNumber: 3,
    closedTabs: [createClosedTabFixture("closed-bookmark", group.id, createTabFixture("tab-2", "short"))],
  });
  await openClosedPanel(page);
  await restoreFirstClosedTab(page);
  await chooseTabMenuItem(page, "Bookmark");
  await closeActiveTab(page);

  await expect(page.getByRole("alertdialog")).toHaveCount(0);
  expect((await readStoredState(page)).closedTabs?.[0].tab).toMatchObject({ content: "short", bookmarked: true });
});
