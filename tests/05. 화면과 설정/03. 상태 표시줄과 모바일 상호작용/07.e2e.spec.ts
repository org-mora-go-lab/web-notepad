import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../../__constant__";

test.use({ viewport: MOBILE_VIEWPORT, hasTouch: true, isMobile: true, reducedMotion: "no-preference" });

test("7. 모바일 아이콘 클릭은 원형 배경 강조와 함께 버튼 기능을 실행하고 효과를 제거한다", async ({ page }) => {
  await page.goto("/");
  const menu = page.locator(".more-command");
  const icon = (await menu.locator("svg").boundingBox())!;
  await page.clock.install({ time: new Date("2026-01-01T00:00:00Z") });
  await page.clock.pauseAt(new Date("2026-01-02T00:00:00Z"));
  await page.evaluate(() => {
    document.addEventListener("click", () => {
      document.querySelector(".mobile-tap-feedback")?.getAnimations().forEach((animation) => animation.pause());
    }, { once: true });
  });
  await menu.tap();
  const ripple = page.locator(".mobile-tap-feedback");
  await expect(ripple).toHaveCount(1);
  await expect(ripple).toHaveCSS("pointer-events", "none");
  await expect(ripple).toHaveCSS("animation-duration", "0.18s");
  await expect(ripple).toHaveCSS("border-width", "0px");
  await expect(ripple).toHaveCSS("background-image", "none");
  const scales = await ripple.evaluate((element) => {
    const animation = element.getAnimations()[0];
    const effect = animation.effect as KeyframeEffect;
    return effect.getKeyframes().map((frame) => frame.transform);
  });
  expect(scales.every((transform) => !transform || transform === "none")).toBe(true);
  await expect(page.locator("#footer-more-menu")).toBeVisible();
  const box = (await ripple.boundingBox())!;
  expect(box.width).toBeCloseTo(Math.max(40, Math.max(icon.width, icon.height) + 16), 0);
  expect(box.height).toBeCloseTo(box.width, 0);
  expect(box.x + box.width / 2).toBeCloseTo(icon.x + icon.width / 2, 0);
  expect(box.y + box.height / 2).toBeCloseTo(icon.y + icon.height / 2, 0);
  await ripple.evaluate((element) => element.getAnimations().forEach((animation) => animation.finish()));
  await page.clock.runFor(500);
  await expect(ripple).toHaveCount(0);
});
