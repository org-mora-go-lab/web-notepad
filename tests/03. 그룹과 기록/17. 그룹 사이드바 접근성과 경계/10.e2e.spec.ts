import { expect, test } from "@playwright/test";

test("10. 모바일 사이드바에서는 PC 크기 조절선을 숨긴다", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Toggle sidebar" }).click();
  await expect(page.getByRole("separator", { name: "Resize group panel" })).toBeHidden();
});
