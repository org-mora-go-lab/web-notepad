import { test } from "@playwright/test";

import { expectLowerTabSplitRight } from "./__util__";

test("1. 일반 그룹의 하단 탭은 기존 우상단을 유지하고 우하단으로 이동한다", async ({ page }) => {
  await expectLowerTabSplitRight(page, { allGroup: false, hasRightTop: true });
});
