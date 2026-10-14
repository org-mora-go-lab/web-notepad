import { test } from "@playwright/test";

import { expectThirdBottomTabSplitRight } from "./__util__";

test("5. 일반 그룹의 하단 탭 3을 Split right로 옮기고 탭 1·2를 유지한다", async ({ page }) => {
  await expectThirdBottomTabSplitRight(page, false);
});
