import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../../__constant__";

test.use({ viewport: MOBILE_VIEWPORT, hasTouch: true, isMobile: true, reducedMotion: "no-preference" });

test("1. 모바일 아이콘 클릭은 파동을 표시하면서 버튼 기능을 실행하고 효과를 제거한다", async ({ page }) => {
  await page.goto("/");
  const search = page.locator(".global-search-command");
  const icon = (await search.locator("svg").boundingBox())!;
  await page.clock.install({ time: new Date("2026-01-01T00:00:00Z") });
  await page.clock.pauseAt(new Date("2026-01-02T00:00:00Z"));
  await page.evaluate(() => {
    document.addEventListener("click", () => {
      document.querySelector(".mobile-tap-feedback")?.getAnimations().forEach((animation) => animation.pause());
    }, { once: true });
  });
  await search.tap();
  const ripple = page.locator(".mobile-tap-feedback");
  await expect(ripple).toHaveCount(1);
  await expect(ripple).toHaveCSS("pointer-events", "none");
  await expect(ripple).toHaveCSS("animation-duration", "0.292s");
  const scales = await ripple.evaluate((element) => {
    const animation = element.getAnimations()[0];
    const effect = animation.effect as KeyframeEffect;
    return effect.getKeyframes().map((frame) => frame.transform);
  });
  expect(scales).toEqual(["scale(0.224)", "scale(0.768)"]);
  await expect(page.locator("#global-search-popup")).toBeVisible();
  const box = (await ripple.boundingBox())!;
  expect(box.x + box.width / 2).toBeCloseTo(icon.x + icon.width / 2, 0);
  expect(box.y + box.height / 2).toBeCloseTo(icon.y + icon.height / 2, 0);
  await ripple.evaluate((element) => element.getAnimations().forEach((animation) => animation.finish()));
  await page.clock.runFor(500);
  await expect(ripple).toHaveCount(0);
});
