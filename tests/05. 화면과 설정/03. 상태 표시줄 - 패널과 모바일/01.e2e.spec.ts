import { expect, test } from "@playwright/test";

test("1. PC와 모바일 하단 메뉴는 가로 스크롤 없이 정해진 버튼 높이로 표시된다", async ({ page }) => {
  await page.goto("/");
  const commands = page.locator(".status-meta .status-command:visible");
  for (const width of [320, 390, 640, 641, 1280]) {
    await page.setViewportSize({ width, height: 844 });
    const count = 3;
    await expect(commands).toHaveCount(count);
    for (const command of await commands.all()) {
      await expect(command).toBeInViewport();
      const bounds = (await command.boundingBox())!;
      expect(bounds.height).toBeCloseTo(width <= 640 ? 61.2 : 35, 1);
    }
    expect(await page.locator(".footer").evaluate((bar) => bar.scrollWidth <= bar.clientWidth)).toBe(true);
  }
});
