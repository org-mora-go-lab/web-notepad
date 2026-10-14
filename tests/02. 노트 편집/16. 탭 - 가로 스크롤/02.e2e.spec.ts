import { expect, test } from "@playwright/test";

test("2. 넘치지 않는 탭 영역은 세로 휠 입력을 가로 이동으로 바꾸지 않는다", async ({ page }) => {
  await page.goto("/");
  const result = await page.locator(".tabs-scroll").evaluate((element) => {
    const wheelEvent = new WheelEvent("wheel", {
      bubbles: true,
      cancelable: true,
      deltaY: 120,
    });
    element.dispatchEvent(wheelEvent);
    return {
      defaultPrevented: wheelEvent.defaultPrevented,
      scrollLeft: element.scrollLeft,
    };
  });

  expect(result).toEqual({ defaultPrevented: false, scrollLeft: 0 });
});
