import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../__constant__";
import { activeTabItem, addTabButton, chooseTabMenuItem } from "../__util__";

test("3. 일반·고정 탭 사이에 그레이 구분선을 표시하고 상단 강조선과 탭 너비를 유지한다", async ({ page }) => {
  await page.goto("/");
  await page.locator("textarea").fill("pinned note");
  const pinnedTab = page.locator(".tab-item").first();
  await chooseTabMenuItem(page, "Pin");
  await addTabButton(page).click();
  await addTabButton(page).click();

  for (const theme of ["DARK", "LIGHT"]) {
    await page.getByRole("button", { name: "MENU", exact: true }).click();
    await page.getByRole("menuitem", { name: "THEME", exact: true }).click();
    await page.getByRole("menuitemradio", { name: theme, exact: true }).click();
    for (const viewport of BOTH_VIEWPORTS) {
      await page.setViewportSize(viewport);
      const items = page.locator(".tab-item, .add-tab");
      for (const item of await items.all()) {
        await expect(item).toHaveCSS("border-left-width", "0px");
        await expect(item).toHaveCSS("border-right-width", "0px");
      }
      await expect(pinnedTab).toHaveClass(/is-pinned/);
      await expect(activeTabItem(page)).toHaveCSS("box-shadow", /0px 2px 0px 0px inset/);
      await pinnedTab.locator('[role="tab"]').click();
      await expect(pinnedTab).toHaveCSS("box-shadow", /0px 2px 0px 0px inset/);
      const tabs = page.locator(".tab-item");
      await expect(tabs).toHaveCount(3);
      const separators = await tabs.evaluateAll(elements => elements.map(element => {
        const style = getComputedStyle(element, "::before");
        return {
          content: style.content,
          width: style.width,
          height: style.height,
          tabHeight: getComputedStyle(element).height,
          top: style.top,
          bottom: style.bottom,
          background: style.backgroundColor,
          opacity: style.opacity,
          lineColor: getComputedStyle(element.closest(".header")!).borderBottomColor,
          pointerEvents: style.pointerEvents,
        };
      }));
      expect(separators[0].content).toBe("none");
      for (const separator of separators.slice(1)) {
        expect(separator.content).toBe('""');
        expect(separator.width).toBe("1px");
        expect(separator.top).toBe("0px");
        expect(separator.bottom).toBe("0px");
        expect(separator.height).toBe(separator.tabHeight);
        expect(separator.background).toBe(separator.lineColor);
        expect(separator.opacity).toBe("0.6");
        expect(separator.pointerEvents).toBe("none");
      }
      for (const tab of await tabs.all()) {
        await expect(tab).toHaveCSS("min-width", viewport.width <= 640 ? "114.406px" : "130.485px");
      }
    }
  }
});