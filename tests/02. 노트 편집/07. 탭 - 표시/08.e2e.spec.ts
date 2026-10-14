import { expect, test } from "@playwright/test";

test("8. PC 탭 제목은 15px 글자로 수직 중앙에 배치한다", async ({ page }) => {
  await page.goto("/");
  const tab = page.locator(".tab-item").first();
  const title = tab.locator(".tab-title");
  await expect(title).toHaveCSS("font-size", "15px");
  const tabBounds = (await tab.boundingBox())!;
  const titleBounds = (await title.boundingBox())!;
  const topGap = titleBounds.y - tabBounds.y;
  const bottomGap = tabBounds.y + tabBounds.height - titleBounds.y - titleBounds.height;
  expect(topGap).toBeCloseTo(bottomGap, 1);
});
