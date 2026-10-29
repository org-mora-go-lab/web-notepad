import { expect, test } from "@playwright/test";

test("1. PC와 모바일 하단 메뉴는 가로 스크롤 없이 정해진 버튼 높이로 표시된다", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".auth-command:not(.is-loading)")).toBeVisible();
  const commands = page.locator(
    ".status-meta .status-command:visible, .footer .auth-command",
  );
  for (const width of [320, 390, 512, 513, 640, 1280]) {
    await page.setViewportSize({ width, height: 844 });
    const count = 3;
    await expect(commands).toHaveCount(count);
    const group = (await page.locator(".group-select-command").boundingBox())!;
    const dashboard = (await page.locator(".dashboard-command").boundingBox())!;
    expect(group.x).toBeLessThan(dashboard.x);
    const account = (await page
      .locator(".footer .auth-command")
      .boundingBox())!;
    expect(dashboard.x).toBeLessThan(account.x);
    for (const command of await commands.all()) {
      await expect(command).toBeInViewport();
      const bounds = (await command.boundingBox())!;
      expect(bounds.height).toBeCloseTo(width <= 512 ? 61.2 : 35, 1);
    }
    if (width <= 512) {
      const centers = (
        await Promise.all(
          (await commands.all()).map(async (command) => {
            const bounds = (await command.boundingBox())!;
            return bounds.x + bounds.width / 2;
          }),
        )
      ).sort((left, right) => left - right);
      const gaps = centers
        .slice(1)
        .map((center, index) => center - centers[index]);
      expect(Math.max(...gaps) - Math.min(...gaps)).toBeLessThanOrEqual(1);
    }
    expect(
      await page
        .locator(".footer")
        .evaluate((bar) => bar.scrollWidth <= bar.clientWidth),
    ).toBe(true);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator(".dashboard-command").click();
  await expect(page.locator(".mobile-tap-feedback")).toHaveCount(0);
});
