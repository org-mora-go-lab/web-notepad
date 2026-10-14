import { expect, test } from "@playwright/test";

test("2. 모바일 하단 높이에 안전 영역을 더하고 편집기를 하단 메뉴 바로 위까지 채운다", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto("/");

  for (const width of [320, 390, 640]) {
    await page.setViewportSize({ width, height: 844 });
    const footerBounds = (await page.locator(".footer").boundingBox())!;
    const editorBounds = (await page.locator(".pane-group").boundingBox())!;
    expect(footerBounds.height).toBeCloseTo(76.8, 1);
    expect(editorBounds.y).toBe(0);
    expect(editorBounds.y + editorBounds.height).toBeCloseTo(footerBounds.y, 1);
    expect(editorBounds.height).toBeCloseTo(844 - footerBounds.height, 1);
  }

  const safeAreaLayoutRule = await page.evaluate(() =>
    Array.from(document.styleSheets).some((sheet) => {
      try {
        return Array.from(sheet.cssRules).some((rule) =>
          rule.cssText.includes("--footer-height") &&
          rule.cssText.includes("env(safe-area-inset-bottom)"),
        );
      } catch {
        return false;
      }
    }),
  );
  expect(safeAreaLayoutRule).toBe(true);
});
