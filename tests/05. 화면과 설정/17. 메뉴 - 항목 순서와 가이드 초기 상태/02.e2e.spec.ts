import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";

test("2. MENU의 SEARCH는 CLOSED 바로 다음에 표시한다", async ({ page }) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "MENU", exact: true });

  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await trigger.click();
    const classes = await page
      .getByRole("menu", { name: "MENU", exact: true })
      .locator('[role="menuitem"]:visible')
      .evaluateAll((items) => items.map((item) => item.className));
    const closedIndex = classes.findIndex((className) => className.includes("closed-command"));
    const searchIndex = classes.findIndex((className) => className.includes("additional-tools-search"));
    expect(closedIndex).toBeGreaterThanOrEqual(0);
    expect(searchIndex).toBe(closedIndex + 1);
    await page.keyboard.press("Escape");
  }
});
