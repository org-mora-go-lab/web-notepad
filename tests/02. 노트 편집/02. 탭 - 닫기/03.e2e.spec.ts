import { expect, test } from "@playwright/test";

import { createPinnedAndBookmarkedTabs } from "../../__util__";

test("3. 고정 탭에는 일반 닫기 버튼을 표시하지 않는다", async ({ page }) => {
  const { pinnedTab: tab } = await createPinnedAndBookmarkedTabs(page);
  await expect(tab).toHaveClass(/is-pinned/);
  await expect(tab.locator(".tab-close")).toHaveCount(0);
});
