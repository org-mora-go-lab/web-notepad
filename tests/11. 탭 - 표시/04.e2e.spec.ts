import { expect, test } from "@playwright/test";

test("4. PC 탭과 헤더 높이는 39px이며 제목을 수직 중앙에 배치한다", async ({ page }) => {
  await page.goto("/");
  const tab = page.locator(".tab-item").first();
  const title = tab.locator(".tab-title");

  await expect(tab).toHaveCSS("height", "39px");
  await expect(tab.getByRole("tab")).toHaveCSS("height", "39px");
  await expect(tab.locator(".tab-close")).toHaveCSS("height", "39px");
  await expect(page.locator(".header")).toHaveCSS("height", "39px");
  await expect(page.locator(".add-tab")).toHaveCSS("height", "39px");
  const tabBounds = (await tab.boundingBox())!;
  const titleBounds = (await title.boundingBox())!;
  const topGap = titleBounds.y - tabBounds.y;
  const bottomGap = tabBounds.y + tabBounds.height - titleBounds.y - titleBounds.height;
  expect(topGap).toBeCloseTo(bottomGap, 1);
  await expect.poll(() => page.locator(".note-pane").evaluate(
    (element) => getComputedStyle(element).gridTemplateRows.split(" ")[0],
  )).toBe("39px");
  await expect(tab).toHaveCSS("min-width", "130.485px");
  await expect(tab).toHaveCSS("max-width", "300.655px");
  await expect(title).toHaveCSS("font-size", "15px");
  expect(await tab.locator(".dirty-dot").evaluate(
    (element) => getComputedStyle(element, "::before").width,
  )).toBe("11px");
});