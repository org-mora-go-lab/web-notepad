import { expect, test } from "@playwright/test";

test("10. 모바일 상태 표시줄은 76.8px 높이와 21px 좌우·안전 영역 패딩을 적용한다", async ({ page }) => {
  const viewport = { width: 390, height: 844 };
  await page.setViewportSize(viewport);
  await page.goto("/");
  const statusBar = page.locator(".footer");
  await expect(statusBar).toHaveCSS("padding-top", "6px");
  await expect(statusBar).toHaveCSS("padding-right", "21px");
  await expect(statusBar).toHaveCSS("padding-bottom", "6px");
  await expect(statusBar).toHaveCSS("padding-left", "21px");
  const safeAreaRules = await page.evaluate(() => {
    const collect = (rules: CSSRuleList): string[] => Array.from(rules).flatMap((rule) => [
      rule.cssText,
      ...("cssRules" in rule ? collect((rule as CSSGroupingRule).cssRules) : []),
    ]);
    return Array.from(document.styleSheets).flatMap((sheet) => {
      try {
        return collect(sheet.cssRules);
      } catch {
        return [];
      }
    }).filter((text) => text.includes(".footer") && text.includes("safe-area-inset-bottom"));
  });
  expect(safeAreaRules.join("\n")).toContain("env(safe-area-inset-bottom)");
  expect((await statusBar.boundingBox())!.height).toBeCloseTo(76.8, 1);
  expect((await statusBar.boundingBox())!.y + 76.8).toBeCloseTo(viewport.height, 1);
});
