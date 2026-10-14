import { test } from "@playwright/test";

import { expectRightTabMoveLeft } from "./__util__";

test("2. 우측에 탭이 남아도 좌하단에는 Move here만 표시하고 기존 우측 패널을 유지한다", async ({ page }) => {
  await expectRightTabMoveLeft(page, true);
});
