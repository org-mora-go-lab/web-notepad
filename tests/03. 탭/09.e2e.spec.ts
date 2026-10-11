import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../__constant__";

test("9. PC 탭은 39px 높이에 제목을 중앙 정렬하고 모바일 탭 크기를 유지한다", async ({ page }) => {
  await page.goto("/");

  const tab = page.locator(".tab-item").first();
  const title = tab.locator(".tab-title");
  const colorIcon = tab.locator(".dirty-dot");
  const iconWidth = () => colorIcon.evaluate((element) =>
    getComputedStyle(element, "::before").width,
  );

  await expect(tab).toHaveCSS("height", "39px");
  await expect(tab.getByRole("tab")).toHaveCSS("height", "39px");
  await expect(tab.locator(".tab-close")).toHaveCSS("height", "39px");
  await expect(page.locator(".header")).toHaveCSS("height", "39px");
  await expect(page.locator(".add-tab")).toHaveCSS("height", "39px");
  const tabBounds = await tab.boundingBox();
  const titleBounds = await title.boundingBox();
  expect(tabBounds).not.toBeNull();
  expect(titleBounds).not.toBeNull();
  const topGap = titleBounds!.y - tabBounds!.y;
  const bottomGap = tabBounds!.y + tabBounds!.height - titleBounds!.y - titleBounds!.height;
  expect(topGap).toBeCloseTo(bottomGap, 1);
  await expect.poll(() => page.locator(".note-pane").evaluate((element) =>
    getComputedStyle(element).gridTemplateRows.split(" ")[0],
  )).toBe("39px");
  await expect(tab).toHaveCSS("min-width", "130.485px");
  await expect(tab).toHaveCSS("max-width", "300.655px");
  await expect(title).toHaveCSS("font-size", "15px");
  expect(await iconWidth()).toBe("11px");

  await page.setViewportSize(MOBILE_VIEWPORT);
  await expect(tab).toHaveCSS("height", "46px");
  await expect(tab).toHaveCSS("padding-bottom", "2px");
  await expect(page.locator(".header")).toHaveCSS("height", "46px");
  await expect(page.locator(".add-tab")).toHaveCSS("height", "46px");
  await expect(page.locator(".add-tab")).toHaveCSS("padding-bottom", "2px");
  await expect.poll(() => page.locator(".note-pane").evaluate((element) =>
    getComputedStyle(element).gridTemplateRows.split(" ")[0],
  )).toBe("46px");
  await expect(tab).toHaveCSS("min-width", "114.406px");
  await expect(tab).toHaveCSS("max-width", "247.65px");
  await expect(tab.getByRole("tab")).toHaveCSS("height", "44px");
  await expect(tab.locator(".tab-close")).toHaveCSS("height", "44px");
  await expect(title).toHaveCSS("font-size", "15px");
  expect(await iconWidth()).toBe("13px");
  const mobileTabBounds = (await tab.boundingBox())!;
  const mobileTitleBounds = (await title.boundingBox())!;
  const mobileTopGap = mobileTitleBounds.y - mobileTabBounds.y;
  const mobileBottomGap = mobileTabBounds.y + mobileTabBounds.height - mobileTitleBounds.y - mobileTitleBounds.height;
  expect(mobileBottomGap - mobileTopGap).toBeCloseTo(2, 1);
});