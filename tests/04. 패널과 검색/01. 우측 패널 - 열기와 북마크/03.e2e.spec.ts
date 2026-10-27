import { expect, test } from "@playwright/test";

import { openPanel } from "../../__util__";
import { RIGHT_PANEL_IDS } from "../__constant__";

test("3. 우측 패널은 한 번에 하나만 열린다", async ({ page }) => {
  await page.goto("/");
  for (const openId of RIGHT_PANEL_IDS) {
    await openPanel(page, openId);
    for (const panelId of RIGHT_PANEL_IDS) {
      await expect(page.locator(`#${panelId}`)).toHaveAttribute(
        "aria-hidden",
        panelId === openId ? "false" : "true",
      );
    }
    await page.locator(`#${openId} .side-panel-close`).click();
    await expect(page.locator(`#${openId}`)).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  }
});
