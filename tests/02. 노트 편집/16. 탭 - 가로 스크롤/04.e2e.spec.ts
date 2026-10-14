import { expect, test } from "@playwright/test";

import { overflowTabs, scrollTabs } from "../01. 탭/__util__";

test("4. 가로 델타가 있는 트랙패드 입력은 가로 변환 없이 페이드 상태를 유지한다", async ({ page }) => {
  await page.goto("/");
  await overflowTabs(page);
  const header = page.locator(".header");
  const scroller = header.locator(".tabs-scroll");
  await scroller.locator(".tab-select").first().click();
  await scrollTabs(scroller, "start");

  const result = await scroller.evaluate((element) => {
    const beforeScrollLeft = element.scrollLeft;
    const wheelEvent = new WheelEvent("wheel", {
      bubbles: true,
      cancelable: true,
      deltaX: 40,
      deltaY: 120,
    });
    element.dispatchEvent(wheelEvent);
    return {
      beforeScrollLeft,
      defaultPrevented: wheelEvent.defaultPrevented,
      scrollLeft: element.scrollLeft,
    };
  });

  expect(result).toEqual({
    beforeScrollLeft: 0,
    defaultPrevented: false,
    scrollLeft: 0,
  });
  await expect(header).toHaveClass(/has-right-overflow/);
  await expect(scroller).toHaveCSS("mask-image", /linear-gradient/);
});
