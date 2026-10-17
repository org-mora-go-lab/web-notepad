import { expect, test } from "@playwright/test";

import { seedStoredStateOnLoad } from "../../__util__";

test("1. 저장 상태가 null이면 기본 작업공간으로 복구한다", async ({ page }) => {
  await seedStoredStateOnLoad(page, null);
  await expect(page.locator(".tab-item")).toHaveCount(1);
  await expect(page.locator("textarea")).toBeEditable();
});
