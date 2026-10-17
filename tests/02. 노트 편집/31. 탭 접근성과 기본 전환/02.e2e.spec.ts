import { expect, test } from "@playwright/test";

test("2. 기본 탭은 선택된 tab으로 표시한다", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("tab", { selected: true })).toHaveCount(1);
});
