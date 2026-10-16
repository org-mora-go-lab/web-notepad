import { expect, test } from "@playwright/test";

import { dashboardPanel, seedScrollableDashboard } from "../../__util__";

test("3. PC 대시보드 헤더는 카드 목록을 스크롤해도 상단에 고정한다", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await seedScrollableDashboard(page);
  const panel = dashboardPanel(page);
  const list = panel.locator(".dashboard-list");
  const header = panel.locator(".side-panel-header");
  const y = await header.evaluate((element) => element.getBoundingClientRect().y);

  await list.evaluate((element) => {
    element.scrollTop = 200;
  });

  await expect
    .poll(() => header.evaluate((element) => element.getBoundingClientRect().y))
    .toBe(y);
  await expect
    .poll(() => panel.locator(".dashboard-statuses").evaluate(
      (element) => getComputedStyle(element, "::after").opacity,
    ))
    .toBe("1");

  const blur = await panel.locator(".dashboard-statuses").evaluate((element) => {
    const style = getComputedStyle(element, "::after");
    return {
      height: style.height,
      backdropFilter: style.backdropFilter,
      webkitBackdropFilter: style.getPropertyValue("-webkit-backdrop-filter"),
      maskImage: style.maskImage,
      webkitMaskImage: style.getPropertyValue("-webkit-mask-image"),
      opacity: style.opacity,
      pointerEvents: style.pointerEvents,
    };
  });
  const mask = blur.maskImage !== "none" ? blur.maskImage : blur.webkitMaskImage;
  expect(blur.height).toBe("24px");
  expect([blur.backdropFilter, blur.webkitBackdropFilter]).toContain("blur(2px)");
  expect(mask).toContain("linear-gradient");
  expect(blur.opacity).toBe("1");
  expect(blur.pointerEvents).toBe("none");
});
