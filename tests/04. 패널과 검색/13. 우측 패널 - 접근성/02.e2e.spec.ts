import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../../__constant__";
import { openPanel } from "../../__util__";
import { RIGHT_PANEL_VIEWPORTS } from "../__constant__";

test("2. Escape로 패널을 닫으면 모바일의 패널 진입 버튼 포커스를 해제한다", async ({ page }) => {
  await page.setViewportSize(MOBILE_VIEWPORT);
  await page.goto("/");
  const mobilePanels = RIGHT_PANEL_VIEWPORTS.find(
    ({ viewport }) => viewport.width === MOBILE_VIEWPORT.width,
  )!.panelIds;

  for (const panelId of mobilePanels) {
    await openPanel(page, panelId);
    const panel = page.locator("#" + panelId);
    await page.keyboard.press("Escape");
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
