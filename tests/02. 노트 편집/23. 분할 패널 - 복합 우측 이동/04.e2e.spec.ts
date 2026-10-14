import { test } from "@playwright/test";

import { expectLowerTabSplitRight } from "./__util__";

test("4. All Group에 오른쪽 열이 없으면 하단 탭을 새 우상단으로 이동한다", async ({ page }) => {
  await expectLowerTabSplitRight(page, { allGroup: true, hasRightTop: false });
});
