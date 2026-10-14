import { expect, test } from "@playwright/test";

import { paneSlot } from "../__util__";
import { createAllGroupQuad } from "../14. 분할 패널 - All Group/__util__";

test("1. All Group의 4분할 배치를 새로고침 후 복원한다", async ({ page }) => {
  await createAllGroupQuad(page);
  await page.reload();

  await expect(page.locator(".pane-slot")).toHaveCount(4);
  await expect(paneSlot(page, "left-bottom").locator("textarea")).toHaveValue("d");
  await expect(paneSlot(page, "right-bottom").locator("textarea")).toHaveValue("b");
});
