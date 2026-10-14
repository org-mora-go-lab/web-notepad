import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";
import { activeTabItem, addTabButton } from "../../__util__";

test("5. 탭 색상 변경과 탭 전환 뒤에도 에디터 커서는 그레이를 유지한다", async ({ page }) => {
  await page.goto("/");
  const editor = page.locator("textarea");
  const activeTab = activeTabItem(page);
  const gray = "rgb(184, 184, 176)";

  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    for (const color of ["gray", "green", "purple"]) {
      await expect(activeTab).toHaveAttribute("data-tab-color", color);
      await expect(editor).toHaveCSS("caret-color", gray);
      await activeTab.locator(".dirty-dot").click();
    }

    await addTabButton(page).click();
    await expect(editor).toHaveCSS("caret-color", gray);
    await page.locator('.tab-item [role="tab"]').first().click();
    await expect(editor).toHaveCSS("caret-color", gray);
  }
});
