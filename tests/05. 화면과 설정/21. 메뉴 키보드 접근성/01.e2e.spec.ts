import { expect, test } from "@playwright/test";

test("1. MENU 명령은 menu 팝업 제어 대상과 펼침 상태를 제공한다", async ({ page }) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "MENU", exact: true });
  await expect(trigger).toHaveAttribute("aria-controls", "additional-tools-menu");
  await expect(trigger).toHaveAttribute("aria-haspopup", "menu");
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
});
