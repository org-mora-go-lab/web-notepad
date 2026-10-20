import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../../__constant__";
import { openGuide, writeStoredState } from "../../__util__";

test("6. 한국어 모바일 가이드는 단축키 없이 메모 작성부터 시작한다", async ({
  page,
}) => {
  await page.setViewportSize(MOBILE_VIEWPORT);
  await writeStoredState(page, { settings: { language: "ko" } });
  const guide = await openGuide(page);
  await expect(guide.locator("h4")).toHaveText("메모 작성");
  await expect(guide.locator(".user-guide-progress")).toHaveText("1 / 10");
  await expect(guide.locator(".user-guide-shortcut")).toHaveCount(0);
});
