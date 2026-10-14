import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";
import { overflowTabs } from "../01. 탭/__util__";

test("1. 탭 가로 스크롤바는 오버플로우 감지 전후 모두 숨긴다", async ({ page }) => {
  await page.goto("/");
  const scroller = page.locator(".tabs-scroll");
  await expect(scroller).not.toHaveClass(/is-overflowing/);
  await expect(scroller).toHaveCSS("scrollbar-width", "none");
  await overflowTabs(page);

  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await expect(scroller).toHaveClass(/is-overflowing/);
    const hiddenScrollbar = await scroller.evaluate((element) => {
      if (!(element instanceof HTMLElement)) throw new Error("Expected an HTML tab scroller");
      element.classList.remove("is-overflowing");
      const result = {
        scrollbarWidth: getComputedStyle(element).scrollbarWidth,
        scrollbarDisplay: getComputedStyle(element, "::-webkit-scrollbar").display,
        verticalSpace: element.offsetHeight - element.clientHeight,
      };
      element.classList.add("is-overflowing");
      return result;
    });
    expect(hiddenScrollbar).toEqual({
      scrollbarWidth: "none",
      scrollbarDisplay: "none",
      verticalSpace: 0,
    });
  }
});
