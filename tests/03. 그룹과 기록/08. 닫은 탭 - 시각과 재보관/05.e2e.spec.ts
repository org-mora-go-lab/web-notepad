import { expect, test } from "@playwright/test";

import {
  createClosedTabFixture,
  createGroupFixture,
  createTabFixture,
} from "../../__fixture__";
import {
  chooseTabMenuItem,
  closeActiveTab,
  openClosedPanel,
  readStoredState,
  restoreFirstClosedTab,
  writeStoredState,
} from "../../__util__";

test("5. 수정하지 않은 짧거나 북마크된 복원 탭도 닫은 탭에 다시 보관한다", async ({
  page,
}) => {
  const group = createGroupFixture("ungrouped", "Ungrouped", [
    createTabFixture("tab-1", ""),
  ]);
  await writeStoredState(page, {
    groups: [group],
    activeGroupId: group.id,
    nextTabNumber: 3,
    closedTabs: [
      createClosedTabFixture(
        "closed-short",
        group.id,
        createTabFixture("tab-2", "short"),
      ),
    ],
  });

  await openClosedPanel(page);
  await restoreFirstClosedTab(page);
  await expect(page.locator("textarea")).toHaveValue("short");
  await closeActiveTab(page);
  await expect(page.getByRole("alertdialog")).toHaveCount(0);
  let stored = await readStoredState(page);
  expect(stored.closedTabs?.map((entry) => entry.tab.content)).toContain("short");

  await openClosedPanel(page);
  await restoreFirstClosedTab(page);
  await chooseTabMenuItem(page, "Bookmark");
  await closeActiveTab(page);
  await expect(page.getByRole("alertdialog")).toHaveCount(0);
  stored = await readStoredState(page);
  expect(stored.closedTabs).toHaveLength(1);
  expect(stored.closedTabs?.[0].tab).toMatchObject({
    content: "short",
    bookmarked: true,
  });
});
