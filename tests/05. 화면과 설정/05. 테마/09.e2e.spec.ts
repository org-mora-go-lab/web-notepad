import { expect, test } from "@playwright/test";

test("9. 잘못된 저장 테마를 DARK로 복원한다", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("web-notepad-theme", "invalid");
  });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});
