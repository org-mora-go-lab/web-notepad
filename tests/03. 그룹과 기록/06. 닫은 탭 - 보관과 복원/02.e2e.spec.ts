import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";
import { closedCommand } from "../../__util__";

test("2. PC와 모바일에서 CLOSED 개수가 0이면 개수를 숨긴다", async ({ page }) => {
  await page.goto("/");

  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await page.getByRole("button", { name: "MENU", exact: true }).click();
    await expect(closedCommand(page).locator(".closed-count")).toHaveCount(0);
    await page.keyboard.press("Escape");
  }
});
