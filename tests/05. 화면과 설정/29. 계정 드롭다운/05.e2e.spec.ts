import { expect, test } from "@playwright/test";

import { authenticateBrowser } from "../../__util__";

test("5. Alarm 목록은 PC와 모바일의 우측 상단에 표시한다", async ({ page, context }) => {
  await authenticateBrowser(context);
  for (const width of [1280, 320]) {
    await page.setViewportSize({ width, height: 800 }); await page.goto("/");
    await page.locator("button.auth-command").click(); await page.getByRole("menuitem", { name: "Alarm", exact: true }).click();
    const popup = page.getByRole("dialog", { name: "Alarm", exact: true }); await expect(popup).toBeVisible();
    const box = (await popup.boundingBox())!;
    expect(box.y).toBeGreaterThanOrEqual(48); expect(box.y).toBeLessThanOrEqual(80);
    expect(width - box.x - box.width).toBeCloseTo(16, 0);
    await page.keyboard.press("Escape");
  }
});
