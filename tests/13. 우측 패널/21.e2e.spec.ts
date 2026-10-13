import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../__constant__";
import { openPanel } from "../__util__";

test("21. 미고정 패널 경계는 테마별 그라데이션을 표시하고 고정·닫기 시 제거한다", async ({ page }) => {
  await page.goto("/");
  const panel = page.locator("#bookmarks-panel");
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await openPanel(page, "bookmarks-panel");
    const edge = await panel.evaluate((element) => {
      const style = getComputedStyle(element, "::before");
      return { background: style.backgroundImage, width: style.width, pointerEvents: style.pointerEvents };
    });
    expect(edge.background).toContain("linear-gradient");
    expect(edge.background).toContain("rgba(255, 255, 255, 0.16)");
    await page.evaluate(() => document.documentElement.setAttribute("data-theme", "light"));
    expect(await panel.evaluate((element) => getComputedStyle(element, "::before").backgroundImage)).toContain("rgba(0, 0, 0, 0.22)");
    await page.evaluate(() => document.documentElement.setAttribute("data-theme", "dark"));
    expect(edge.width).toBe("18px");
    expect(edge.pointerEvents).toBe("none");

    if (viewport.width > 640) {
      await panel.locator(".side-panel-pin").click();
      expect(await panel.evaluate((element) => getComputedStyle(element, "::before").content)).toBe("none");
      await panel.locator(".side-panel-pin").click();
      expect(await panel.evaluate((element) => getComputedStyle(element, "::before").backgroundImage)).toContain("linear-gradient");
    }
    await panel.locator(".side-panel-close").click();
    expect(await panel.evaluate((element) => getComputedStyle(element, "::before").content)).toBe("none");
  }
});
