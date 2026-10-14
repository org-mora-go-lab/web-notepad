import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../../__constant__";
import { createGroupFixture, createTabFixture } from "../../__fixture__";
import { seedStoredStateOnLoad } from "../../__util__";

test("2. 터치 장치에서 좌우 분할 편집기를 전환해도 커서 위치를 다시 설정하지 않는다", async ({
  browser,
}) => {
  const page = await browser.newPage({
    hasTouch: true,
    isMobile: true,
    viewport: MOBILE_VIEWPORT,
  });
  try {
    const content = "First line\nSecond line\nThird line";
    await seedStoredStateOnLoad(page, {
      activeGroupId: "ungrouped",
      groups: [
        createGroupFixture(
          "ungrouped",
          "Ungrouped",
          [
            createTabFixture("left", content),
            createTabFixture("right", content),
          ],
          {
            rightTabIds: ["right"],
            activeRightTabId: "right",
            splitRatio: 0.5,
          },
        ),
      ],
    });
    const editors = page.locator("textarea");
    await expect(editors).toHaveCount(2);
    for (const paneIndex of [1, 0, 1, 0]) {
      const editor = editors.nth(paneIndex);
      await editor.tap({ position: { x: 25, y: 20 } });
      await expect(editor).toBeFocused();
      await editor.evaluate(
        () =>
          new Promise<void>((resolve) => {
            requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
          }),
      );
      const selection = await editor.evaluate(
        (element: HTMLTextAreaElement) => ({
          start: element.selectionStart,
          end: element.selectionEnd,
        }),
      );
      expect(selection.start).toBe(selection.end);
      expect(selection.end).toBeLessThan(content.length);
      await expect(editor).toHaveValue(content);
    }
  } finally {
    await page.close();
  }
});
