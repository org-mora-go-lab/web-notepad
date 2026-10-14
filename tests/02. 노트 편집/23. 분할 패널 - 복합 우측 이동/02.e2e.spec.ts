import { test } from "@playwright/test";

import { expectLowerTabSplitRight } from "./__util__";

test("2. All Group의 하단 탭도 기존 우상단을 유지하고 우하단으로 이동한다", async ({ page }) => {
  await expectLowerTabSplitRight(page, { allGroup: true, hasRightTop: true });
});
