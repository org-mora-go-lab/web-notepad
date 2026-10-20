import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../../__constant__";
import { openGuide } from "../../__util__";

test("7. 가이드를 연 채 PC에서 모바일로 바꾸면 단축키 단계를 즉시 제외한다", async ({
  page,
}) => {
  await page.goto("/");
  const guide = await openGuide(page);
  await expect(guide.locator(".user-guide-shortcut")).toBeVisible();
  await page.setViewportSize(MOBILE_VIEWPORT);
  await expect(guide.locator("h4")).toHaveText("Write notes");
  await expect(guide.locator(".user-guide-progress")).toHaveText("1 / 10");
  await expect(guide.locator(".user-guide-shortcut")).toHaveCount(0);
});
