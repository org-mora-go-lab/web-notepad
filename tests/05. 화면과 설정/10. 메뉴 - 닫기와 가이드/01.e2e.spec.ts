import { expect, test } from "@playwright/test";

test("1. MENU 드롭다운에서 Tab을 누르면 드롭다운을 닫는다", async ({ page }) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "MENU", exact: true });
  await trigger.press("Enter");
  await page.keyboard.press("Tab");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
});
