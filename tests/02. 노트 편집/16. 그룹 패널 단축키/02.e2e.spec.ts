import { expect, test } from "@playwright/test";

test("2. Cmd+B의 반복 keydown은 무시하고 다음 누름은 처리한다", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("textarea")).toBeVisible();
  await page.keyboard.down("Meta");
  await page.keyboard.down("b");
  await expect(page.locator("#groups-menu")).toBeVisible();
  await page.keyboard.down("b");
  await page.keyboard.down("b");
  await expect(page.locator("#groups-menu")).toBeVisible();
  await page.keyboard.up("b");
  await page.keyboard.down("b");
  await page.keyboard.up("b");
  await page.keyboard.up("Meta");
  await expect(page.locator("#groups-menu")).toHaveCount(0);
});
