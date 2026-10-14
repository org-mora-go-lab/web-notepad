import { expect, test } from "@playwright/test";

import { openPanel } from "../../__util__";

test("9. 미고정 패널은 헤더·푸터 배치를 유지한 채 두 영역 위를 덮고 바깥 클릭 영역은 화면 전체를 채운다", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 844 });
  await page.goto("/");
  const before = {
    header: await page.locator(".header").boundingBox(),
    footer: await page.locator(".footer").boundingBox(),
  };
  await openPanel(page, "bookmarks-panel");
  expect(await page.locator(".header").boundingBox()).toEqual(before.header);
  expect(await page.locator(".footer").boundingBox()).toEqual(before.footer);
  const panel = (await page.locator("#bookmarks-panel").boundingBox())!;
  const header = before.header!;
  const footer = before.footer!;
  expect(panel.y).toBeLessThanOrEqual(header.y);
  expect(panel.y + panel.height).toBeGreaterThanOrEqual(footer.y + footer.height);
  const backdrop = (await page.locator(".bookmark .side-panel-backdrop").boundingBox())!;
  expect(backdrop.height).toBeCloseTo(844, 0);
});
