import { test } from "@playwright/test";

import { expectRightTabMoveLeft } from "./__util__";

test("8. 우측의 마지막 탭은 좌하단에 Move here로 합치고 빈 우측 패널을 정리한다", async ({
  page,
}) => {
  await expectRightTabMoveLeft(page, false);
});
