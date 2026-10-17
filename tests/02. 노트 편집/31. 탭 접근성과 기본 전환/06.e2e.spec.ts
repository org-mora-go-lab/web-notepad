import { expect, test } from "@playwright/test";

test("6. 새 탭을 만들면 새 탭이 선택 상태가 된다", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "New tab", exact: true }).click();
  await expect(page.getByRole("tab", { selected: true })).toHaveText("-");
  await expect(page.getByRole("tab", { selected: false })).toHaveCount(1);
});
