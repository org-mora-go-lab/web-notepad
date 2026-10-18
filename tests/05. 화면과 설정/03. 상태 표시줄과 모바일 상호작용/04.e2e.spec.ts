import { expect, test } from "@playwright/test";

test("4. 패널은 X로 닫고 하단 메뉴 활성 표시를 해제한다", async ({ page }) => {
  await page.goto("/");
  const command = page.locator(".dashboard-command");
  const panel = page.locator("#dashboard-panel");
  await command.click();
  await page.locator("#dashboard-panel .side-panel-close").click();
  await expect(panel).toHaveAttribute("aria-hidden", "true");
  await expect(command).toHaveAttribute("aria-expanded", "false");
  await expect(command).not.toHaveClass(/is-active/);
});
