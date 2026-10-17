import { expect, test } from "@playwright/test";

test("5. 하단 상태 영역은 footer 요소로 제공한다", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("footer.footer")).toBeVisible();
});
