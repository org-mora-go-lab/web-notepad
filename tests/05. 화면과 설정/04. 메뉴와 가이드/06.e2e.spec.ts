import { expect, test } from "@playwright/test";

import { openGuide } from "../../__util__";

test("6. 사용 가이드 팝업은 Escape로 닫는다", async ({ page }) => {
  await page.goto("/");
  const guide = await openGuide(page);
  await expect(guide).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(guide).toHaveCount(0);
});
