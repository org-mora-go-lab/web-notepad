import { expect, test } from "@playwright/test";

test("7. PC 탭 제목은 15px로 수직 중앙에 배치하고 색상 아이콘은 가로·세로 11px다", async ({ page }) => {
  await page.goto("/");
  const tab = page.locator(".tab-item").first();
  const title = tab.locator(".tab-title");

  await expect(title).toHaveCSS("font-size", "15px");
  const tabBounds = (await tab.boundingBox())!;
  const titleBounds = (await title.boundingBox())!;
  const topGap = titleBounds.y - tabBounds.y;
  const bottomGap = tabBounds.y + tabBounds.height - titleBounds.y - titleBounds.height;
  expect(topGap).toBeCloseTo(bottomGap, 1);
  const iconSize = await tab.locator(".dirty-dot").evaluate((element) => {
    const style = getComputedStyle(element, "::before");
    return { width: style.width, height: style.height };
  });
  expect(iconSize).toEqual({ width: "11px", height: "11px" });
});
