import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";
import { expectCssPx } from "../../__util__";

test("4. MENU 드롭다운 항목은 PC에서 아이콘 18px·글자 15px, 모바일에서 아이콘 21.6px·글자 18px로 표시한다", async ({ page }) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "MENU", exact: true });
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    const mobile = viewport.width <= 640;
    await trigger.click();
    const menu = page.getByRole("menu", { name: "MENU", exact: true });
    await expect(page.getByRole("menuitem", { name: "THEME" })).toBeVisible();
    const items = await menu.locator('[role="menuitem"]:visible').all();
    expect(items.length).toBeGreaterThan(0);
    for (const item of items) {
      await expect(item).toHaveCSS("font-size", mobile ? "18px" : "15px");
      await expectCssPx(item.locator("svg").first(), "width", mobile ? 21.6 : 18);
    }
    await page.keyboard.press("Escape");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  }
});
