import { expect, test } from "@playwright/test";

test("1. PC와 모바일 하단 메뉴는 스크롤 없이 표시되고 각 패널을 열고 닫는다", async ({ page }) => {
  await page.goto("/");
  const commands = page.locator(".status-meta .status-command:visible");
  for (const width of [320, 390, 640, 641, 1280]) {
    await page.setViewportSize({ width, height: 844 });
    const count = 3;
    await expect(commands).toHaveCount(count);
    for (const command of await commands.all()) {
      await expect(command).toBeInViewport();
      const bounds = (await command.boundingBox())!;
      if (width <= 640) {
      }
      expect(bounds.height).toBeCloseTo(width <= 640 ? 61.2 : 35, 1);
      const label = command.locator(".status-label:visible, .global-search-label:visible");
      await expect(label).toBeVisible();
      if (width <= 640 && /bookmark-command|dashboard-command/.test((await command.getAttribute("class")) ?? "")) {
        const below = (await label.boundingBox())!;
        const icon = (await command.locator("svg").boundingBox())!;
        expect(below.y).toBeGreaterThanOrEqual(icon.y + icon.height);
        continue;
      }
      const labelBounds = (await label.boundingBox())!;
      const iconBounds = (await command.locator("svg").boundingBox())!;
      expect(labelBounds.x).toBeGreaterThanOrEqual(iconBounds.x + iconBounds.width);
      expect(labelBounds.y + labelBounds.height / 2).toBeCloseTo(iconBounds.y + iconBounds.height / 2, 1);
      expect(labelBounds.x).toBeGreaterThanOrEqual(bounds.x);
      expect(labelBounds.x + labelBounds.width).toBeLessThanOrEqual(bounds.x + bounds.width);
    }
    expect(await page.locator(".footer").evaluate((bar) => bar.scrollWidth <= bar.clientWidth)).toBe(true);
  }

  for (const command of await commands.all()) {
    const panelId = await command.getAttribute("aria-controls");
    await command.click();
    await expect(command).toHaveAttribute("aria-expanded", "true");
    await expect(command).toHaveClass(/is-active/);
    // The group button opens a dropdown (removed when closed); the others open side panels.
    const target = page.locator(`#${panelId}`);
    if (panelId === "groups-menu") await expect(target).toBeVisible();
    else await expect(target).toHaveAttribute("aria-hidden", "false");
    if (panelId !== "groups-menu") {
      // An unpinned full-height drawer covers its footer command; close it from the panel.
      await target.locator(".side-panel-close").click();
      await expect(command).toHaveAttribute("aria-expanded", "false");
      await command.click();
      await target.getByRole("button", { name: "패널 고정", exact: true }).click();
      await command.click();
      await expect(target).toHaveAttribute("aria-hidden", "true");
      await command.click();
      await target.getByRole("button", { name: "패널 고정 해제", exact: true }).click();
    }
    await page.keyboard.press("Escape");
    await expect(command).toHaveAttribute("aria-expanded", "false");
    if (panelId === "groups-menu") await expect(target).toHaveCount(0);
    else await expect(target).toHaveAttribute("aria-hidden", "true");
  }
});
