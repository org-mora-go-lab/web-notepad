import { expect, test } from "@playwright/test";

import { createTabFixture } from "../../__fixture__";
import { readStoredState, seedStoredStateOnLoad } from "../../__util__";

test("7. 저장된 탭의 유효한 boolean 상태만 유지하고 non-boolean 고정·북마크 값은 false로 복원한다", async ({
  page,
}) => {
  await seedStoredStateOnLoad(page, {
    activeGroupId: "ungrouped",
    groups: [
      {
        id: "ungrouped",
        name: "Ungrouped",
        activeTabId: "tab-1",
        tabs: [
          createTabFixture("tab-1", "valid true", {
            pinned: true,
            bookmarked: true,
          }),
          createTabFixture("tab-2", "valid false", {
            pinned: false,
            bookmarked: false,
          }),
          {
            ...createTabFixture("tab-3", "invalid string"),
            pinned: "false",
            bookmarked: "yes",
          },
          {
            ...createTabFixture("tab-4", "invalid number"),
            pinned: 1,
            bookmarked: 1,
          },
        ],
      },
    ],
  });

  const tabs = page.locator(".tab-item");
  await expect(tabs).toHaveCount(4);
  await expect(tabs.nth(0)).toHaveClass(/is-pinned/);
  await expect(tabs.nth(0)).toHaveClass(/is-bookmarked/);
  for (const index of [1, 2, 3]) {
    await expect(tabs.nth(index)).not.toHaveClass(/is-pinned/);
    await expect(tabs.nth(index)).not.toHaveClass(/is-bookmarked/);
  }

  await tabs.nth(1).getByRole("tab").click();
  const restoredTabs = (await readStoredState(page)).groups[0].tabs;
  expect(
    restoredTabs.map(({ pinned, bookmarked }) => ({ pinned, bookmarked })),
  ).toEqual([
    { pinned: true, bookmarked: true },
    { pinned: false, bookmarked: false },
    { pinned: false, bookmarked: false },
    { pinned: false, bookmarked: false },
  ]);
});
