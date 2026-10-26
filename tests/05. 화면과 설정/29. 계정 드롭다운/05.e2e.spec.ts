import { expect, test } from "@playwright/test";

import { authenticateBrowser, openPanel } from "../../__util__";

test("5. Alarm 목록은 프로필 버튼 아래를 기준으로 열리고 화면 크기를 따라 위치를 갱신한다", async ({ page, context }) => {
  await authenticateBrowser(context); await page.goto("/");
  await openPanel(page, "dashboard-panel");
  const trigger = page.locator("button.auth-command"); await trigger.click();
  await page.getByRole("menuitem", { name: "Alarm", exact: true }).click();
  const popup = page.getByRole("dialog", { name: "Alarm", exact: true });
  for (const width of [1280, 1000, 320]) {
    await page.setViewportSize({ width, height: 800 });
    await expect(popup).toBeVisible();
    await expect.poll(async () => {
      const anchor = (await trigger.boundingBox())!, box = (await popup.boundingBox())!;
      return Math.abs(box.y - anchor.y - anchor.height - 7);
    }).toBeLessThan(2);
    const anchor = (await trigger.boundingBox())!, box = (await popup.boundingBox())!;
    expect(box.x).toBeCloseTo(Math.max(8, Math.min(anchor.x + anchor.width - box.width, width - box.width - 8)), 0);
    expect(box.x).toBeGreaterThanOrEqual(8); expect(box.x + box.width).toBeLessThanOrEqual(width - 8);
  }
  await page.keyboard.press("Escape"); await expect(trigger).toBeFocused();
});
