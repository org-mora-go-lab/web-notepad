import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../__constant__";

test("9. 모바일 탭 제목은 16px, 색상 아이콘은 가로·세로 13px이며 아이콘 세로 위치를 유지한다", async ({ page }) => {
  await page.setViewportSize(MOBILE_VIEWPORT);
  await page.goto("/");
  const tab = page.locator(".tab-item").first();
  const title = tab.locator(".tab-title");

  await expect(title).toHaveCSS("font-size", "16px");
  const iconSize = await tab.locator(".dirty-dot").evaluate((element) => {
    const style = getComputedStyle(element, "::before");
    return { width: style.width, height: style.height };
  });
  expect(iconSize).toEqual({ width: "13px", height: "13px" });
  await expect(page.locator(".add-tab")).toHaveCSS("padding-bottom", "1px");
  const tabBounds = (await tab.boundingBox())!;
  const titleBounds = (await title.boundingBox())!;
  const topGap = titleBounds.y - tabBounds.y;
  const bottomGap = tabBounds.y + tabBounds.height - titleBounds.y - titleBounds.height;
  expect(bottomGap - topGap).toBeCloseTo(1, 1);
});
