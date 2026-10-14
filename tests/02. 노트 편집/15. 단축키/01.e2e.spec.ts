import { expect, test } from "@playwright/test";

test("1. Alt+Tab은 활성 패널에 새 탭을 추가한다", async ({ page }) => {
  await page.goto("/");
  const tabs = page.getByRole("tab");
  await page.locator("textarea").focus();
  await page.keyboard.press("Alt+Tab");
  await expect(tabs).toHaveCount(2);
  await expect(tabs.last()).toHaveAttribute("aria-selected", "true");
});
