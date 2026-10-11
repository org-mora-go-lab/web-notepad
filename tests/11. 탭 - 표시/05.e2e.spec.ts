import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../__constant__";

test("5. 모바일 탭 제목은 16px이며 탭 높이는 45px, 하단 추가 여백은 1px이다", async ({ page }) => {
  await page.setViewportSize(MOBILE_VIEWPORT);
  await page.goto("/");
  const tab = page.locator(".tab-item").first();
  const title = tab.locator(".tab-title");

  await expect(tab).toHaveCSS("height", "45px");
  await expect(tab).toHaveCSS("padding-bottom", "1px");
  await expect(page.locator(".header")).toHaveCSS("height", "45px");
  await expect(page.locator(".add-tab")).toHaveCSS("height", "45px");
  await expect(page.locator(".add-tab")).toHaveCSS("padding-bottom", "1px");
  await expect.poll(() => page.locator(".note-pane").evaluate(
    (element) => getComputedStyle(element).gridTemplateRows.split(" ")[0],
  )).toBe("45px");
  await expect(tab).toHaveCSS("min-width", "114.406px");
  await expect(tab).toHaveCSS("max-width", "247.65px");
  await expect(tab.getByRole("tab")).toHaveCSS("height", "44px");
  await expect(tab.locator(".tab-close")).toHaveCSS("height", "44px");
  await expect(title).toHaveCSS("font-size", "16px");
  expect(await tab.locator(".dirty-dot").evaluate(
    (element) => getComputedStyle(element, "::before").width,
  )).toBe("13px");
  const tabBounds = (await tab.boundingBox())!;
  const titleBounds = (await title.boundingBox())!;
  const topGap = titleBounds.y - tabBounds.y;
  const bottomGap = tabBounds.y + tabBounds.height - titleBounds.y - titleBounds.height;
  expect(bottomGap - topGap).toBeCloseTo(1, 1);
});