import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";
import { addTabButton, chooseTabMenuItem } from "../../__util__";

test("3. 인접한 일반·고정 탭 사이에 탭 전체 높이의 1px 그레이 구분선을 표시하고 탭 너비를 유지한다", async ({ page }) => {
  await page.goto("/");
  await page.locator("textarea").fill("pinned note");
  const pinnedTab = page.locator(".tab-item").first();
  await chooseTabMenuItem(page, "Pin");
  await addTabButton(page).click();
  await addTabButton(page).click();
  await expect(pinnedTab).toHaveClass(/is-pinned/);

  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    const tabs = page.locator(".tab-item");
    await expect(tabs).toHaveCount(3);
    const separators = await tabs.evaluateAll(elements => elements.slice(1).map(element => {
      const style = getComputedStyle(element, "::before");
      return {
        content: style.content,
        width: style.width,
        height: style.height,
        tabHeight: getComputedStyle(element).height,
        top: style.top,
        bottom: style.bottom,
        pointerEvents: style.pointerEvents,
      };
    }));
    for (const separator of separators) {
      expect(separator.content).toBe('""');
      expect(separator.width).toBe("1px");
      expect(separator.top).toBe("0px");
      expect(separator.bottom).toBe("0px");
      expect(separator.height).toBe(separator.tabHeight);
      expect(separator.pointerEvents).toBe("none");
    }
    for (const tab of await tabs.all()) {
      await expect(tab).toHaveCSS("min-width", viewport.width <= 640 ? "137.287px" : "130.485px");
    }
  }
});
