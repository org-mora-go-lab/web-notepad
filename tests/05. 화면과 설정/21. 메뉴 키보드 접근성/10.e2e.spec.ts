import { expect, test } from "@playwright/test";

test("10. 기능 항목과 그룹 이동 항목 사이에 separator를 제공한다", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "MENU", exact: true }).click();
  await expect(page.getByRole("menu", { name: "MENU" }).getByRole("separator")).toHaveCount(1);
});
