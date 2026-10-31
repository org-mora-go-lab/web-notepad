import type { Locator } from "@playwright/test";

// Dispatches one complete touch gesture through the public DOM event boundary.
// Assertions stay in each scenario; only the repeated physical input is shared.
export async function swipeTouch(target: Locator, direction: "left" | "right") {
  await target.evaluate((element, swipeDirection) => {
    const bounds = element.getBoundingClientRect();
    const y = bounds.top + bounds.height / 2;
    const point = (ratio: number) =>
      new Touch({
        identifier: 1,
        target: element,
        clientX: bounds.left + bounds.width * ratio,
        clientY: y,
      });
    const start = point(swipeDirection === "left" ? 0.8 : 0.2);
    element.dispatchEvent(
      new TouchEvent("touchstart", {
        bubbles: true,
        cancelable: true,
        touches: [start],
        changedTouches: [start],
      }),
    );
    const end = point(swipeDirection === "left" ? 0.2 : 0.8);
    element.dispatchEvent(
      new TouchEvent("touchend", {
        bubbles: true,
        cancelable: true,
        touches: [],
        changedTouches: [end],
      }),
    );
  }, direction);
}
