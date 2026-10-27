import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT } from "../../__constant__";
import { openPanel } from "../../__util__";
import { closePanelWithX, workspaceBounds } from "../__util__";

test("3. X로 고정 패널을 닫으면 작업 영역을 복원한다", async ({ page }) => {
  await page.setViewportSize(DESKTOP_VIEWPORT);
  await page.goto("/");
  await openPanel(page, "dashboard-panel");
  await closePanelWithX(page, "dashboard-panel");

  await expect
    .poll(async () => (await workspaceBounds(page)).width)
    .toBe(DESKTOP_VIEWPORT.width);
});
