import { expect, test } from "@playwright/test";

import { openGuide } from "../../__util__";

test("4. 모달 가이드에서 Cmd+B는 뒤쪽 그룹 패널을 열지 않는다", async ({ page }) => {
  await page.goto("/");
  const guide = await openGuide(page);
  await page.keyboard.press("Meta+b");
  await expect(guide).toBeVisible();
  await expect(page.locator("#groups-menu")).toHaveCount(0);
  await page.keyboard.press("Escape");
  await page.keyboard.press("Meta+b");
  await expect(page.locator("#groups-menu")).toBeVisible();
});
