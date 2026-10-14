import { expect, test } from "@playwright/test";

import { createTabFixture } from "../../__fixture__";
import { seedStoredStateOnLoad } from "../../__util__";

test("7. 저장된 탭의 유효한 pinned·bookmarked boolean 값을 유지한다", async ({ page }) => {
  await seedStoredStateOnLoad(page, {
    activeGroupId: "ungrouped",
    groups: [{
      id: "ungrouped",
      name: "Ungrouped",
      activeTabId: "tab-1",
      tabs: [
        createTabFixture("tab-1", "valid true", { pinned: true, bookmarked: true }),
        createTabFixture("tab-2", "valid false", { pinned: false, bookmarked: false }),
      ],
    }],
  });

  const tabs = page.locator(".tab-item");
  await expect(tabs.nth(0)).toHaveClass(/is-pinned/);
  await expect(tabs.nth(0)).toHaveClass(/is-bookmarked/);
  await expect(tabs.nth(1)).not.toHaveClass(/is-pinned/);
  await expect(tabs.nth(1)).not.toHaveClass(/is-bookmarked/);
});
