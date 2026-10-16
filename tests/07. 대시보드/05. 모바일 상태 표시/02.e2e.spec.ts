import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../../__constant__";
import { openPanel } from "../../__util__";
import { dashboardColumn, seedDashboardTabs } from "../../__util__";

test.use({ hasTouch: true, isMobile: true, viewport: MOBILE_VIEWPORT });

test("2. 모바일 상태 영역 왼쪽에 70% 불투명도의 3px 상태색 세로선을 이어서 표시한다", async ({ page }) => {
  await seedDashboardTabs(page);
  await openPanel(page, "dashboard-panel");

  const column = dashboardColumn(page, "in-progress");
  await expect(column).toHaveCSS("border-left-width", "3px");
  const title = column.locator(".dashboard-column-status");
  await expect(title).toHaveCSS("padding-top", "9px");
  await expect(title).toHaveCSS("padding-bottom", "9px");
  await expect(title).toHaveCSS("font-size", "17.8px");
  await expect(title.locator(".dashboard-count")).toHaveCSS("font-size", "15.4px");
  await expect(title.locator(".dashboard-count")).toHaveCSS("padding-right", "13px");
  for (const pseudo of ["::before", "::after"]) {
    const fog = await title.evaluate((element, selector) => {
      const style = getComputedStyle(element, selector);
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = 1;
      const context = canvas.getContext("2d")!;
      const sample = (color: string) => {
        context.clearRect(0, 0, 1, 1);
        context.fillStyle = color;
        context.fillRect(0, 0, 1, 1);
        return Array.from(context.getImageData(0, 0, 1, 1).data);
      };
      return {
        height: style.height,
        mask: style.maskImage,
        color: sample(style.backgroundColor),
        accent: sample(getComputedStyle(element).getPropertyValue("--dashboard-accent").trim()),
        pointerEvents: style.pointerEvents,
      };
    }, pseudo);
    expect(fog.height).toBe("5px");
    expect(fog.mask).toMatch(pseudo === "::before"
      ? /^linear-gradient\(to top, rgb\(0, 0, 0\)/
      : /^linear-gradient\((?:to bottom, )?rgb\(0, 0, 0\)/);
    expect(fog.mask).toContain("rgba(0, 0, 0, 0)");
    expect(fog.color[3]).toBeGreaterThan(0);
    expect(fog.color[3]).toBeLessThan(255);
    for (let channel = 0; channel < 3; channel++) {
      expect(Math.abs(fog.color[channel] - fog.accent[channel])).toBeLessThanOrEqual(3);
    }
    expect(fog.pointerEvents).toBe("none");
  }
  const borderColor = await column.evaluate(
    (element) => getComputedStyle(element).borderLeftColor,
  );
  expect(borderColor).toMatch(/(?:0\.7|70%)/);

  const columnBox = (await column.boundingBox())!;
  const titleBox = (await title.boundingBox())!;
  const cardBox = (await column.locator(".dashboard-card").first().boundingBox())!;
  expect(columnBox.y).toBeCloseTo(titleBox.y, 0);
  expect(columnBox.y + columnBox.height).toBeGreaterThanOrEqual(
    cardBox.y + cardBox.height,
  );
});
