import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT, MOBILE_VIEWPORT } from "../../__constant__";
import { openGuide } from "../../__util__";

test("9. 모바일 가이드를 PC로 확장하면 단축키 단계를 다시 제공한다", async ({
  page,
}) => {
  await page.setViewportSize(MOBILE_VIEWPORT);
  await page.goto("/");
  const guide = await openGuide(page);
  await page.setViewportSize(DESKTOP_VIEWPORT);
  await expect(guide.locator(".user-guide-progress")).toHaveText("1 / 11");
  await expect(guide.locator("h4")).toHaveText("Keyboard shortcuts");
  await expect(guide.locator(".user-guide-shortcut")).toBeVisible();
});
