import { expect, test } from "@playwright/test";

import { openPanel } from "../../__util__";

test("1. 모바일 오버레이 경계는 11.52px의 테마별 다단계 그라데이션으로 표시한다", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await openPanel(page, "dashboard-panel");
  const panel = page.locator("#dashboard-panel");
  const edge = async () => panel.evaluate((element) => {
    const style = getComputedStyle(element, "::before");
    return { background: style.backgroundImage, width: style.width };
  });
  let value = await edge();
  expect(Number.parseFloat(value.width)).toBeCloseTo(11.52, 1);
  expect(value.background).toContain("rgba(255, 255, 255, 0.16)");
  expect(value.background).toContain("30%");
  expect(value.background).toContain("65%");

  await page.evaluate(() => document.documentElement.setAttribute("data-theme", "light"));
  value = await edge();
  expect(value.background).toContain("rgba(0, 0, 0, 0.22)");
});
