import { test } from "@playwright/test";

import { expectTabCloseCancellation } from "./__util__";

test("2. Escape로 닫기를 취소하면 탭과 포커스를 유지한다", async ({ page }) => {
  await expectTabCloseCancellation(page, "escape");
});
