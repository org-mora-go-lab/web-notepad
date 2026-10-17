import { expect, test } from "@playwright/test";

test("4. Escape로 메뉴를 닫으면 MENU 명령으로 포커스를 복원한다", async ({ page }) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "MENU", exact: true });
  await trigger.click();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("menu", { name: "MENU", exact: true })).toBeHidden();
  await expect(trigger).toBeFocused();
});
