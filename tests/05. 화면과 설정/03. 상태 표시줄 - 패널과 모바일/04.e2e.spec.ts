import { expect, test } from "@playwright/test";

test("4. 하단 메뉴 항목은 연결된 메뉴·패널을 열고 활성 상태를 표시한다", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/");

  for (const command of await page.locator(".status-meta .status-command:visible").all()) {
    const panelId = await command.getAttribute("aria-controls");
    const target = page.locator(`#${panelId}`);
    await command.click();
    await expect(command).toHaveAttribute("aria-expanded", "true");
    await expect(command).toHaveClass(/is-active/);

    if (panelId === "groups-menu") {
      await expect(target).toBeVisible();
      await page.keyboard.press("Escape");
      continue;
    }

    await expect(target).toHaveAttribute("aria-hidden", "false");
    await target.locator(".side-panel-close").click();
  }
});
