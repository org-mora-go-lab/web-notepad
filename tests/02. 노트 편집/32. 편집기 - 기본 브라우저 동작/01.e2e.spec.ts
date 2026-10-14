import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../../__constant__";

test.use({ hasTouch: true, isMobile: true, viewport: MOBILE_VIEWPORT });

test("1. 터치 편집기는 길게 누를 때의 컨텍스트 메뉴 이벤트를 차단하지 않는다", async ({ page }) => {
  await page.goto("/");
  const prevented = await page.locator("textarea").evaluate((element) => {
    const event = new MouseEvent("contextmenu", {
      bubbles: true,
      cancelable: true,
      button: 2,
    });
    element.dispatchEvent(event);
    return event.defaultPrevented;
  });
  expect(prevented).toBe(false);
});
