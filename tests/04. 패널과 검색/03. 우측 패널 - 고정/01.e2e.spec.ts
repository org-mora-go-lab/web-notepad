import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT, MOBILE_VIEWPORT } from "../../__constant__";
import { openPanel } from "../../__util__";

test("1. PC와 모바일 패널에는 고정 전환 버튼을 제공하지 않는다", async ({
  page,
}) => {
  await page.setViewportSize(DESKTOP_VIEWPORT);
  await page.goto("/");
  for (const panelId of [
    "dashboard-panel",
    "shortcuts-panel",
    "settings-panel",
  ]) {
    await openPanel(page, panelId);
    await expect(page.locator(`#${panelId}`)).toHaveCSS(
      "transform",
      "matrix(1, 0, 0, 1, 0, 0)",
    );
    await expect(page.locator(`#${panelId} .side-panel-pin`)).toHaveCount(0);
    await page.locator(`#${panelId} .side-panel-close`).click();
  }

  await page.setViewportSize(MOBILE_VIEWPORT);
  await openPanel(page, "dashboard-panel");
  await expect(page.locator("#dashboard-panel .side-panel-pin")).toHaveCount(0);
});
