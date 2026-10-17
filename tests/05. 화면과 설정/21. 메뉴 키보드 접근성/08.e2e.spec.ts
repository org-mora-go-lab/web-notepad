import { expect, test } from "@playwright/test";

test("8. End는 마지막 메뉴 항목으로 포커스를 이동한다", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "MENU", exact: true }).click();
  await page.keyboard.press("End");
  await expect(page.getByRole("menuitem", { name: "GUIDE", exact: true })).toBeFocused();
});
