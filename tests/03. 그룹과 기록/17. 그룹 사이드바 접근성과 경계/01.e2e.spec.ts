import { expect, test } from "@playwright/test";

test("1. SIDEBAR 명령은 제어 대상과 펼침 상태를 제공한다", async ({ page }) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Toggle sidebar" });
  await expect(trigger).toHaveAttribute("aria-controls", "groups-menu");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
});
