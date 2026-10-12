import { expect, test } from "@playwright/test";

test("14. PC와 모바일 하단 메뉴는 스크롤 없이 표시되고 각 패널을 열고 닫는다", async ({ page }) => {
  await page.goto("/");
  const commands = page.locator(".status-meta .status-command:visible");
  for (const width of [320, 390, 640, 641, 1280]) {
    await page.setViewportSize({ width, height: 844 });
    const count = 3;
    await expect(commands).toHaveCount(count);
    for (const command of await commands.all()) {
      await expect(command).toBeInViewport();
      const bounds = (await command.boundingBox())!;
      const className = (await command.getAttribute("class")) ?? "";
      if (width <= 640) {
        expect(bounds.width).toBeCloseTo(className.includes("group-status-command") ? width - 72 * 2 : 72, 1);
      }
      expect(bounds.height).toBe(width <= 640 ? 51 : 35);
      if (className.includes("group-status-command")) {
        const nameBounds = (await command.locator(".group-status-name").boundingBox())!;
        expect(nameBounds.x).toBeGreaterThanOrEqual(bounds.x);
        expect(nameBounds.x + nameBounds.width).toBeLessThanOrEqual(bounds.x + bounds.width);
        continue;
      }
      const label = command.locator(".status-label:visible, .global-search-label:visible");
      await expect(label).toBeVisible();
      const labelBounds = (await label.boundingBox())!;
      const iconBounds = (await command.locator("svg").boundingBox())!;
      if (width <= 640) {
        expect(labelBounds.y).toBeGreaterThanOrEqual(iconBounds.y + iconBounds.height);
      } else {
        expect(labelBounds.x).toBeGreaterThanOrEqual(iconBounds.x + iconBounds.width);
        expect(labelBounds.y + labelBounds.height / 2).toBeCloseTo(iconBounds.y + iconBounds.height / 2, 1);
      }
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
    await expect(page.locator(`#${panelId}`)).toHaveAttribute("aria-hidden", "false");
    await page.keyboard.press("Escape");
    await expect(command).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator(`#${panelId}`)).toHaveAttribute("aria-hidden", "true");
  }
});
