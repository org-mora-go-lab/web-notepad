import { expect, test } from "@playwright/test";

test("1. 탭 모음은 Note tabs 이름의 tablist로 제공한다", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("tablist", { name: "Note tabs" })).toBeVisible();
});
