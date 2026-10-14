import { expect, test } from "@playwright/test";

test("5. PC에서 고정된 BOOKMARK·DASHBOARD 명령을 다시 누르면 패널과 활성 표시를 닫는다", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/");

  for (const selector of [".bookmark-command", ".dashboard-command"]) {
    const command = page.locator(selector);
    const panel = page.locator(`#${await command.getAttribute("aria-controls")}`);
    await command.click();
    await panel.getByRole("button", { name: "Pin panel", exact: true }).click();
    await command.click();
    await expect(panel).toHaveAttribute("aria-hidden", "true");
    await expect(command).toHaveAttribute("aria-expanded", "false");
    await expect(command).not.toHaveClass(/is-active/);
    await command.click();
    await panel.getByRole("button", { name: "Unpin panel", exact: true }).click();
    await panel.locator(".side-panel-close").click();
  }
});
