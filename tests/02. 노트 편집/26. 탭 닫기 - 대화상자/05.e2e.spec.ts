import { test } from "@playwright/test";

import { expectTabCloseCancellation } from "./__util__";

test("5. 바깥 영역 클릭으로 취소하면 탭과 포커스를 유지한다", async ({ page }) => {
  await expectTabCloseCancellation(page, "backdrop");
});
