import { expect, test } from "@playwright/test";

test("6. 작업 영역은 main 내부의 section으로 제공한다", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("main").locator("section.workspace")).toBeVisible();
});
