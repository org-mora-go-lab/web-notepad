import { expect, test } from "@playwright/test";

test("7. MENU의 GUIDE는 드롭다운을 닫고 User Guide 팝업을 연다", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "MENU", exact: true }).click();
  await page.getByRole("menuitem", { name: "GUIDE" }).click();
  await expect(page.getByRole("menu", { name: "MENU", exact: true })).toBeHidden();

  const guide = page.getByRole("dialog");
  await expect(guide).toBeVisible();
  await expect(guide.getByRole("heading", { name: "User Guide" })).toBeVisible();
});
