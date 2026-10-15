import { expect, test } from "@playwright/test";

test("4. MENU는 위·아래 방향키·Home·End로 항목을 탐색한다", async ({ page }) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "MENU", exact: true });
  const items = ["THEME", "SHORTCUT", "SETTINGS", "GUIDE"];
  await trigger.press("Enter");
  await expect(page.getByRole("menuitem", { name: items[0], exact: true })).toBeFocused();

  for (const name of items.slice(1)) {
    await page.keyboard.press("ArrowDown");
    await expect(page.getByRole("menuitem", { name, exact: true })).toBeFocused();
  }
  await page.keyboard.press("Home");
  await expect(page.getByRole("menuitem", { name: "THEME", exact: true })).toBeFocused();
  await page.keyboard.press("ArrowUp");
  await expect(page.getByRole("menuitem", { name: "GUIDE", exact: true })).toBeFocused();
  await page.keyboard.press("End");
  await expect(page.getByRole("menuitem", { name: "GUIDE", exact: true })).toBeFocused();
});
