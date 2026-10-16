import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT } from "../../__constant__";
import { openPanel } from "../../__util__";
import { RIGHT_PANEL_IDS } from "../__constant__";

test("1. X로 패널을 닫으면 PC의 패널 진입 버튼 포커스를 해제한다", async ({ page }) => {
  await page.setViewportSize(DESKTOP_VIEWPORT);
  await page.goto("/");

  for (const panelId of RIGHT_PANEL_IDS) {
    await openPanel(page, panelId);
    const panel = page.locator("#" + panelId);
    await panel.locator(".side-panel-close").click();
    await expect(panel).toHaveAttribute("aria-hidden", "true");
    await expect
      .poll(() =>
        page.evaluate(
          (id) => document.activeElement?.getAttribute("aria-controls") !== id,
          panelId,
        ),
      )
      .toBe(true);
  }
});
