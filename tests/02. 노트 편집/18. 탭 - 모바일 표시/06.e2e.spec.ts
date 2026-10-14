import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../../__constant__";
import { activeTabItem, addTabButton } from "../../__util__";

test("6. 모바일에서 오버플로우 중 활성 탭 제목이 길어져도 탭과 닫기 버튼을 가시 영역 안에 유지한다", async ({ page }) => {
  await page.setViewportSize(MOBILE_VIEWPORT);
  await page.goto("/");

  for (let index = 0; index < 4; index += 1) await addTabButton(page).click();

  await page.locator(".note-area").fill("A long active tab title that expands");
  const scroller = page.locator(".tabs-scroll");
  const activeTab = activeTabItem(page);
  const closeButton = activeTab.locator(".tab-close");

  await expect.poll(async () => {
    const [scrollerBounds, tabBounds, closeBounds] = await Promise.all([
      scroller.boundingBox(),
      activeTab.boundingBox(),
      closeButton.boundingBox(),
    ]);
    if (!scrollerBounds || !tabBounds || !closeBounds) return false;
    const rightEdge = scrollerBounds.x + scrollerBounds.width;
    return (
      tabBounds.x >= scrollerBounds.x &&
      tabBounds.x + tabBounds.width <= rightEdge + 0.5 &&
      closeBounds.x + closeBounds.width <= rightEdge + 0.5
    );
  }).toBe(true);
});
