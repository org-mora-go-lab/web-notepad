import { expect, test } from "@playwright/test";

test("10. 설정 초기화 버튼은 접근 가능한 이름과 툴팁을 제공한다", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "MENU", exact: true }).click();
  await page.getByRole("menuitem", { name: "SETTINGS" }).click();
  await expect(page.getByRole("button", { name: "Reset settings" })).toHaveAttribute("title", "Reset settings");
});
