import { expect, test } from "@playwright/test";

import { seedStoredStateOnLoad } from "../../__util__";

test("1. 누락되거나 잘못된 탭 색상을 그린으로 복원한다", async ({ page }) => {
  await seedStoredStateOnLoad(page, {
    activeGroupId: "ungrouped",
    groups: [
      {
        id: "ungrouped",
        name: "Ungrouped",
        tabs: [
          { id: "tab-1", content: "normalized\nsecond", tabColor: "invalid" },
          { id: "tab-2" },
          { id: "tab-3", tabColor: 42, pinned: "yes" },
        ],
      },
    ],
  });
  const tabs = page.locator(".tab-item");
  await expect(tabs).toHaveCount(3);
  for (const index of [0, 1, 2]) {
    await expect(tabs.nth(index)).toHaveAttribute("data-tab-color", "green");
  }
});
