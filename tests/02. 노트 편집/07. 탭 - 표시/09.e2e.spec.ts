import { expect, test } from "@playwright/test";

test("9. PC 탭 색상 아이콘은 가로·세로 11px다", async ({ page }) => {
  await page.goto("/");
  const iconSize = await page.locator(".tab-item").first().locator(".dirty-dot").evaluate((element) => {
    const style = getComputedStyle(element, "::before");
    return { width: style.width, height: style.height };
  });
  expect(iconSize).toEqual({ width: "11px", height: "11px" });
});
