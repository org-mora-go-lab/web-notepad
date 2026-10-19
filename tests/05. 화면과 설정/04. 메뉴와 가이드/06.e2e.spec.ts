import { expect, test } from "@playwright/test";

import { openHeaderMenu } from "../../__util__";

test("6. 사용 가이드 팝업은 Escape로 닫는다", async ({ page }) => {
  await page.goto("/");
  const tools = await openHeaderMenu(page);
  await tools.getByRole("button", { name: "GUIDE" }).click();
  const guide = page.getByRole("dialog");
  await expect(guide).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(guide).toHaveCount(0);
});
