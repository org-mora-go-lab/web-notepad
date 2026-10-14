import { expect, test } from "@playwright/test";

import { createTabFixture } from "../../__fixture__";
import { readStoredState, seedStoredStateOnLoad } from "../../__util__";

test("8. non-boolean pinned·bookmarked 값을 false로 복원한다", async ({ page }) => {
  await seedStoredStateOnLoad(page, {
    activeGroupId: "ungrouped",
    groups: [{
      id: "ungrouped",
      name: "Ungrouped",
      activeTabId: "tab-1",
      tabs: [
        { ...createTabFixture("tab-1", "invalid string"), pinned: "false", bookmarked: "yes" },
        { ...createTabFixture("tab-2", "invalid number"), pinned: 1, bookmarked: 1 },
      ],
    }],
  });

  const tabs = page.locator(".tab-item");
  for (const tab of await tabs.all()) {
    await expect(tab).not.toHaveClass(/is-pinned/);
    await expect(tab).not.toHaveClass(/is-bookmarked/);
  }
  await tabs.nth(1).getByRole("tab").click();
  const restoredTabs = (await readStoredState(page)).groups[0].tabs;
  expect(restoredTabs.map(({ pinned, bookmarked }) => ({ pinned, bookmarked }))).toEqual([
    { pinned: false, bookmarked: false },
    { pinned: false, bookmarked: false },
  ]);
});
