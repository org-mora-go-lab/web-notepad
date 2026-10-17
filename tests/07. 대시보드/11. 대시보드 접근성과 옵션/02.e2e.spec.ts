import { expect, test } from "@playwright/test";

test("2. 대시보드 옵션 명령은 메뉴 제어 대상과 펼침 상태를 제공한다", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "DASHBOARD" }).click();
  const trigger = page.getByRole("button", { name: "Dashboard options" });
  await expect(trigger).toHaveAttribute("aria-controls", "dashboard-options-menu");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
});
