import { expect, test } from "@playwright/test";

test("10. 메뉴에는 그룹 이동 항목과 separator를 제공하지 않는다", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "MENU", exact: true }).click();
  const menu = page.getByRole("menu", { name: "MENU" });
  await expect(menu.getByRole("separator")).toHaveCount(0);
  await expect(menu.getByRole("menuitem", { name: "All Group", exact: true })).toHaveCount(0);
  await expect(menu.getByRole("menuitem", { name: "Ungrouped", exact: true })).toHaveCount(0);
});
