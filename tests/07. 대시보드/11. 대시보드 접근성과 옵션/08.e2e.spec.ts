import { expect, test } from "@playwright/test";

test("8. 전체 그룹에서는 상태 이름 편집 명령을 비활성화한다", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "MENU", exact: true }).click();
  await page.getByRole("menuitem", { name: "All Group", exact: true }).click();
  await page.getByRole("button", { name: "DASHBOARD" }).click();
  await page.getByRole("button", { name: "Dashboard options" }).click();
  await expect(page.getByRole("button", { name: "Edit Status" })).toBeDisabled();
});
