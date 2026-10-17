import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";
import { openSidebarTools } from "../../__util__";

test("1. 사이드바 MENU는 PC와 모바일에서 지정된 항목 순서로 표시한다", async ({ page }) => {
  await page.goto("/");
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    const tools = await openSidebarTools(page);
    await expect(tools.getByRole("button")).toHaveText(["SHORTCUT", "SETTINGS", "GUIDE"]);
    await expect(tools.getByRole("switch", { name: "THEME" })).toHaveCount(0);
    await expect(tools.getByRole("separator")).toHaveCount(0);
    await page.keyboard.press("Escape");
  }
});
