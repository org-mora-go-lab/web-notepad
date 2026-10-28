import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";
import { openGlobalSearchPanel } from "../../__util__";

test("7. 메뉴 검색은 중앙 모달로 열리고 Escape와 배경 클릭으로 닫는다", async ({
  page,
}) => {
  await page.goto("/");
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await openGlobalSearchPanel(page);

    const popup = page.locator("#global-search-popup");
    const bounds = (await popup.boundingBox())!;
    const trigger = page.locator(".group-select-command");
    expect(bounds.width).toBeCloseTo(Math.min(546, viewport.width - 32), 0);
    expect(bounds.height).toBeCloseTo(Math.min(540.8, viewport.height - 32), 0);
    expect(bounds.x + bounds.width / 2).toBeCloseTo(viewport.width / 2, 0);
    expect(bounds.y + bounds.height / 2).toBeCloseTo(viewport.height / 2, 0);
    expect(await popup.evaluate((element) => element.matches(":modal"))).toBe(
      true,
    );
    await expect(popup).toHaveCSS("border-radius", "6px");
    expect(
      await popup.evaluate(
        (element) => getComputedStyle(element, "::backdrop").backgroundColor,
      ),
    ).toBe("rgba(0, 0, 0, 0.65)");
    await expect(popup.getByRole("searchbox")).not.toBeFocused();
    await expect(popup.locator(".global-search-preview-pane")).toBeHidden();

    await page.keyboard.press("Escape");
    await expect(popup).not.toHaveAttribute("open", "");
    await expect(trigger).toBeFocused();

    await openGlobalSearchPanel(page);
    await page.mouse.click(4, 4);
    await expect(popup).not.toHaveAttribute("open", "");
  }
});
