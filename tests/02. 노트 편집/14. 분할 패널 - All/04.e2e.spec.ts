import { expect, test } from "@playwright/test";

import { createAllGroupQuad } from "./__util__";

test("4. All에서 Split down과 Split right로 최대 4분할한다", async ({ page }) => {
  await createAllGroupQuad(page);
  await expect(page.locator(".pane-slot")).toHaveCount(4);
});
