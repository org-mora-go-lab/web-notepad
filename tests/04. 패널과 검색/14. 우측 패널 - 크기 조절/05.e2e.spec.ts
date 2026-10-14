import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT } from "../../__constant__";
import { openPanel, openSettingsPanel } from "../../__util__";
import { dragPanelEdgeTo } from "../__util__";

test("5. 좌측에 배치한 미고정 패널의 크기를 조절할 수 있다", async ({ page }) => {
  await page.setViewportSize(DESKTOP_VIEWPORT);
  await page.goto("/");
  await openSettingsPanel(page);
  await page
    .locator("#settings-panel")
    .getByRole("radio", { name: "Left", exact: true })
    .check();
  await page.locator("#settings-panel .side-panel-close").click();
  await openPanel(page, "bookmarks-panel");
  const panel = page.locator("#bookmarks-panel");

  await dragPanelEdgeTo(page, "bookmarks-panel", 520);

  await expect
    .poll(async () => (await panel.boundingBox())!.width)
    .toBeCloseTo(520, 1);
});
