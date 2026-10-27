import { expect, test } from "@playwright/test";

test("1. DASHBOARD 명령은 패널 제어 대상과 펼침 상태를 제공한다", async ({
  page,
}) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "DASHBOARD", exact: true });
  await expect(trigger).toHaveAttribute("aria-controls", "dashboard-panel");
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
});
