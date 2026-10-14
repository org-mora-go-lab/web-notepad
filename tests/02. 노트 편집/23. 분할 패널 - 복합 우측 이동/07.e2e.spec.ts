import { test } from "@playwright/test";

import { expectLowerTabSplitRightPersistence } from "./__util__";

test("7. 일반 그룹의 복합 우측 분할 배치를 새로고침 후 복원한다", async ({ page }) => {
  await expectLowerTabSplitRightPersistence(page, false);
});
