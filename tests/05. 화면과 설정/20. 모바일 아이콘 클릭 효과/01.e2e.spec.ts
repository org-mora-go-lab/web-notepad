import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../../__constant__";

test.use({ viewport: MOBILE_VIEWPORT, hasTouch: true, isMobile: true, reducedMotion: "no-preference" });

test("1. 모바일 아이콘 클릭은 파동을 표시하면서 버튼 기능을 실행하고 효과를 제거한다", async ({ page }) => {
  await page.goto("/");
  const menu = page.getByRole("button", { name: "MENU", exact: true });
  const icon = (await menu.locator("svg").boundingBox())!;
  await menu.tap();
  const ripple = page.locator(".mobile-tap-feedback");
  await expect(ripple).toHaveCount(1);
  await expect(ripple).toHaveCSS("pointer-events", "none");
  await expect(page.getByRole("menu", { name: "MENU", exact: true })).toBeVisible();
  const box = (await ripple.boundingBox())!;
  expect(box.x + box.width / 2).toBeCloseTo(icon.x + icon.width / 2, 0);
  expect(box.y + box.height / 2).toBeCloseTo(icon.y + icon.height / 2, 0);
  await expect(ripple).toHaveCount(0);
});
