import { test } from "@playwright/test";

import { expectThirdBottomTabSplitRight } from "./__util__";

test("6. All Group의 하단 탭 3도 Split right로 옮기고 탭 1·2를 유지한다", async ({ page }) => {
  await expectThirdBottomTabSplitRight(page, true);
});
