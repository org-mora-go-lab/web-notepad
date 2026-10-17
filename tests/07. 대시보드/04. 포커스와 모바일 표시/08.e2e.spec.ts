import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../../__constant__";
import { dashboardColumn, dashboardPanel, seedScrollableDashboard } from "../../__util__";

test.use({ hasTouch: true, isMobile: true, viewport: MOBILE_VIEWPORT });

test("8. 모바일 상태 영역 왼쪽에 70% 불투명도의 3px 상태색 세로선을 이어서 표시한다", async ({ page }) => {
  await seedScrollableDashboard(page);

  const column = dashboardColumn(page, "in-progress");
  await expect(column).toHaveCSS("border-left-width", "3px");
  const title = column.locator(".dashboard-column-status");
  await expect(title).toHaveCSS("padding-top", "9px");
  await expect(title).toHaveCSS("padding-bottom", "9px");
  await expect(title).toHaveCSS("font-size", "17.8px");
  await expect(title.locator(".dashboard-count")).toHaveCSS("font-size", "15.4px");
  await expect(title.locator(".dashboard-count")).toHaveCSS("padding-right", "13px");
  const readBlur = (pseudo: "::before" | "::after") =>
    title.evaluate((element, selector) => {
      const style = getComputedStyle(element, selector);
      return {
        height: style.height,
        backdropFilter: style.backdropFilter,
        webkitBackdropFilter: style.getPropertyValue("-webkit-backdrop-filter"),
        maskImage: style.maskImage,
        webkitMaskImage: style.getPropertyValue("-webkit-mask-image"),
        opacity: style.opacity,
        pointerEvents: style.pointerEvents,
      };
    }, pseudo);

  for (const pseudo of ["::before", "::after"] as const) {
    const blur = await readBlur(pseudo);
    expect(blur.opacity).toBe("0");
  }

  await dashboardPanel(page).locator(".dashboard-list").evaluate((element) => {
    element.scrollTop = 1;
  });
  await expect(dashboardPanel(page).locator(".dashboard-content")).toHaveClass(/is-scrolled/);

  const gradients: string[] = [];
  for (const pseudo of ["::before", "::after"] as const) {
    await expect.poll(async () => (await readBlur(pseudo)).opacity).toBe("1");
    const blur = await readBlur(pseudo);
    expect(blur.height).toBe("20px");
    const mask = blur.maskImage !== "none" ? blur.maskImage : blur.webkitMaskImage;
    expect(mask).toContain("linear-gradient");
    expect([blur.backdropFilter, blur.webkitBackdropFilter]).toContain("blur(2px)");
    expect(blur.pointerEvents).toBe("none");
    gradients.push(mask);
  }
  expect(gradients[0]).not.toBe(gradients[1]);
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
