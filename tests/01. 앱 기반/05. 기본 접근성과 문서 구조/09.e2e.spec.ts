import { expect, test } from "@playwright/test";

test("9. 기본 화면의 핵심 조작은 키보드 Tab 순서에 포함한다", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.locator(":focus")).toBeVisible();
  await expect(page.locator(":focus")).not.toHaveAttribute("tabindex", "-1");
});
