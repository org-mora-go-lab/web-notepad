import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../__constant__";
import { openPanel } from "../__util__";

test("14. 우측 패널을 열어도 배경을 어둡게 하지 않고 투명하게 유지하며 바깥 클릭으로 닫는다", async ({ page }) => {
  await page.goto("/");
  const panel = page.locator("#bookmarks-panel");
  const backdrop = page.locator(".bookmark .side-panel-backdrop");
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await openPanel(page, "bookmarks-panel");
    await expect(backdrop).toHaveClass(/is-visible/);
    await expect(backdrop).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    await expect(backdrop).toHaveCSS("opacity", "1");
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

    // On mobile the panel spans the full width, so there is no outside area to click.
    if (viewport.width > 640) await page.mouse.click(5, 200);
    else await page.keyboard.press("Escape");
    await expect(panel).toHaveAttribute("aria-hidden", "true");
    expect(await panel.evaluate((element) => getComputedStyle(element, "::before").content)).toBe("none");
    await expect(backdrop).toHaveCSS("pointer-events", "none");
  }
});
