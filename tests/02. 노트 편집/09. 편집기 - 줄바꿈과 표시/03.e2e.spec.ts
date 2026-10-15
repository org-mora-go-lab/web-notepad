import { expect, test } from "@playwright/test";

import { addTabButton, dragDividerBy, lineButtons } from "../../__util__";
import { WRAPPED_NOTE as content } from "./__constant__";
import { countWrappedLines } from "./__util__";

test("3. 분할 패널 너비를 조정하면 표시 줄과 LINE 번호를 다시 계산한다", async ({ page }) => {
  await page.goto("/");
  const editor = page.locator("textarea");
  await editor.fill(content);
  const fullWidthCount = await lineButtons(page).count();
  await addTabButton(page).click();
  await editor.fill("right");
  await editor.press("Alt+F12");

  const leftPane = page.locator(".pane-slot").nth(0);
  const leftEditor = leftPane.locator("textarea");
  const leftLines = lineButtons(leftPane);
  await expect.poll(() => leftLines.count()).toBe(await countWrappedLines(leftEditor));
  const splitCount = await leftLines.count();
  expect(splitCount).toBeGreaterThan(fullWidthCount);

  await dragDividerBy(page, 300);
  await expect.poll(() => leftLines.count()).toBeLessThan(splitCount);
  await expect.poll(async () => (await leftLines.count()) === (await countWrappedLines(leftEditor))).toBe(true);
});
