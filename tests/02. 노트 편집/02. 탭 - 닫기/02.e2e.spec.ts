import { expect, test } from "@playwright/test";

import { createPinnedAndBookmarkedTabs } from "../../__util__";

test("2. 이전에 고정한 탭도 핀 표시 없이 일반 닫기 버튼으로 닫는다", async ({
  page,
}) => {
  const { pinnedTab: tab } = await createPinnedAndBookmarkedTabs(page);
  await expect(tab).not.toHaveClass(/is-pinned/);
  await expect(tab.locator(".tab-pin-indicator")).toHaveCount(0);
  await expect(tab.locator(".tab-close")).toBeVisible();
  await tab.locator(".tab-close").click();
  await expect(tab).toHaveCount(0);
});
