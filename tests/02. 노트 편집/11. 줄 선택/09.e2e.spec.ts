import { test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../../__constant__";
import { expectSelectedLines, lineButtons } from "../../__util__";

test("9. 저장한 줄 선택은 PC와 모바일에서 동일하게 유지한다", async ({ page }) => {
  await page.goto("/");
  await page.locator("textarea").fill("one\ntwo\nthree");
  await lineButtons(page).nth(1).click();
  await expectSelectedLines(page, [false, true, false]);

  await page.setViewportSize(MOBILE_VIEWPORT);
  await page.reload();
  await expectSelectedLines(page, [false, true, false]);
});
