import { expect, test } from "@playwright/test";

import { overflowTabs, scrollTabs } from "../01. 탭/__util__";

test("3. PC의 세로 마우스 휠로 넘친 탭을 가로 탐색하고 페이드를 갱신한다", async ({ page }) => {
  await page.goto("/");
  await overflowTabs(page);
  const header = page.locator(".header");
  const scroller = header.locator(".tabs-scroll");
  await scroller.locator(".tab-select").first().click();
  await scrollTabs(scroller, "start");
  await expect(header).toHaveClass(/has-right-overflow/);

  const result = await scroller.evaluate((element) => {
    const beforeScrollLeft = element.scrollLeft;
    const wheelEvent = new WheelEvent("wheel", {
      bubbles: true,
      cancelable: true,
      deltaY: 120,
    });
    element.dispatchEvent(wheelEvent);
    return {
      beforeScrollLeft,
      defaultPrevented: wheelEvent.defaultPrevented,
      scrollLeft: element.scrollLeft,
    };
  });
  expect(result.beforeScrollLeft).toBe(0);
  expect(result.defaultPrevented).toBe(true);
  expect(result.scrollLeft).toBeGreaterThan(0);
  await expect(header).toHaveClass(/has-left-overflow/);
  await expect(header).toHaveClass(/has-right-overflow/);
});
