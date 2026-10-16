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
    const blur = await title.evaluate((element, selector) => {
      const style = getComputedStyle(element, selector);
      return {
        height: style.height,
        mask: style.maskImage,
        backdropFilter: style.backdropFilter,
        pointerEvents: style.pointerEvents,
      };
    }, pseudo);
    expect(blur.height).toBe("5px");
    expect(blur.mask).toBe("none");
    expect(blur.backdropFilter).toBe("blur(5px)");
    expect(blur.pointerEvents).toBe("none");
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
