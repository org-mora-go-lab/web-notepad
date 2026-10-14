import { expect, test } from "@playwright/test";

test("4. MENU 드롭다운을 Escape로 닫으면 MENU 버튼에 포커스를 복원한다", async ({ page }) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "MENU", exact: true });
  await trigger.press("Enter");
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
});
