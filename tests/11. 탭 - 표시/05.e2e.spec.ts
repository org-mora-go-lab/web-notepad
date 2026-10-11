import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../__constant__";

test("5. 모바일 탭 하단에만 2px를 추가하고 내부 요소의 세로 위치를 유지한다", async ({ page }) => {
  await page.setViewportSize(MOBILE_VIEWPORT);
  await page.goto("/");
  const tab = page.locator(".tab-item").first();
  const title = tab.locator(".tab-title");

  await expect(tab).toHaveCSS("height", "46px");
  await expect(tab).toHaveCSS("padding-bottom", "2px");
  await expect(page.locator(".header")).toHaveCSS("height", "46px");
  await expect(page.locator(".add-tab")).toHaveCSS("height", "46px");
  await expect(page.locator(".add-tab")).toHaveCSS("padding-bottom", "2px");
  await expect.poll(() => page.locator(".note-pane").evaluate(
    (element) => getComputedStyle(element).gridTemplateRows.split(" ")[0],
  )).toBe("46px");
  await expect(tab).toHaveCSS("min-width", "114.406px");
  await expect(tab).toHaveCSS("max-width", "247.65px");
  await expect(tab.getByRole("tab")).toHaveCSS("height", "44px");
  await expect(tab.locator(".tab-close")).toHaveCSS("height", "44px");
  await expect(title).toHaveCSS("font-size", "15px");
  expect(await tab.locator(".dirty-dot").evaluate(
    (element) => getComputedStyle(element, "::before").width,
  )).toBe("13px");
  const tabBounds = (await tab.boundingBox())!;
  const titleBounds = (await title.boundingBox())!;
  const topGap = titleBounds.y - tabBounds.y;
  const bottomGap = tabBounds.y + tabBounds.height - titleBounds.y - titleBounds.height;
  expect(bottomGap - topGap).toBeCloseTo(2, 1);
});