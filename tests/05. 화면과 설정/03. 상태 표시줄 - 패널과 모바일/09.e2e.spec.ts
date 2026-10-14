import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";

test("9. PC와 모바일의 미고정 사이드 패널은 전체 높이를 채우고 하단 메뉴 위를 덮는다", async ({ page }) => {
  await page.goto("/");
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    const command = page.locator(".bookmark-command");
    await command.click();
    const panel = page.locator("#bookmarks-panel");
    const panelBounds = (await panel.boundingBox())!;
    const footerBounds = (await page.locator(".footer").boundingBox())!;
    expect(panelBounds.y).toBeCloseTo(0, 0);
    expect(panelBounds.height).toBeCloseTo(viewport.height, 0);
    expect(panelBounds.x).toBeLessThan(footerBounds.x + footerBounds.width);
    expect(panelBounds.y + panelBounds.height).toBeGreaterThan(footerBounds.y);
    await panel.locator(".side-panel-close").click();
  }
});
