import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";
import { openSidebarTools } from "../../__util__";

test("1. 사이드바는 PC와 모바일에서 GROUP 아래 맨 아래에 SETTINGS·GUIDE를 표시한다", async ({ page }) => {
  await page.goto("/");
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    const tools = await openSidebarTools(page);
    await expect(tools.getByRole("button")).toHaveText(["SETTINGS", "GUIDE"]);
    const groupToggle = page.locator("#groups-menu").getByRole("button", { name: "GROUP", exact: true });
    const settingsBox = (await tools.getByRole("button", { name: "SETTINGS" }).boundingBox())!;
    const groupBox = (await groupToggle.boundingBox())!;
    expect(settingsBox.y).toBeGreaterThanOrEqual(groupBox.y + groupBox.height);
    await expect(tools.getByRole("switch", { name: "THEME" })).toHaveCount(0);
    await expect(tools.getByRole("separator")).toHaveCount(0);
    await tools.getByRole("button", { name: "GUIDE" }).click();
    await expect(page.locator(".user-guide-progress")).toHaveText("1 / 11");
    await page.keyboard.press("Escape");
    await page.keyboard.press("Escape");
  }
});
