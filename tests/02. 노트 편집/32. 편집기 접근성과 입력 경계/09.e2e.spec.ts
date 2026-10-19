import { expect, test } from "@playwright/test";

test("9. 첫 줄이 비어 있어도 다음 유효한 줄을 탭 제목으로 사용한다", async ({ page }) => {
  await page.goto("/");
  await page.locator("textarea").fill("\nsecond line");
  await expect(page.locator(".tab-title")).toHaveText("second line");
});
