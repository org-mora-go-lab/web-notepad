import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT, MOBILE_VIEWPORT } from "../../__constant__";
import { lineButtons } from "../../__util__";
import { WRAPPED_NOTE as content } from "./__constant__";
import { countWrappedLines } from "./__util__";

test("3. 화면 너비에 따라 표시 줄과 LINE 번호를 함께 늘리거나 줄인다", async ({ page }) => {
  await page.setViewportSize(DESKTOP_VIEWPORT);
  await page.goto("/");
  const editor = page.locator("textarea");
  const lines = lineButtons(page);
  await editor.fill(content);
  await expect.poll(() => lines.count()).toBe(await countWrappedLines(editor));
  const desktopCount = await lines.count();

  await page.setViewportSize(MOBILE_VIEWPORT);
  await expect.poll(() => lines.count()).toBe(await countWrappedLines(editor));
  const mobileCount = await lines.count();
  expect(mobileCount).toBeGreaterThan(desktopCount);

  await page.setViewportSize(DESKTOP_VIEWPORT);
  await expect(lines).toHaveCount(desktopCount);
  await expect(editor).toHaveValue(content);
});
