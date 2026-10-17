import { expect, test } from "@playwright/test";

test("6. 줄 번호에서 Enter를 누르면 해당 줄을 선택한다", async ({ page }) => {
  await page.goto("/");
  const line = page.locator(".line-rail").getByRole("button").first();
  await line.focus();
  await page.keyboard.press("Enter");
  await expect(line).toHaveAttribute("aria-pressed", "true");
});
