import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT } from "../../__constant__";
import { openPanel } from "../../__util__";
import { panelPinButton } from "../__util__";

test("2. 고정한 Dashboard 패널에서 DASHBOARD 명령을 다시 선택하면 패널을 닫는다", async ({ page }) => {
  await page.setViewportSize(DESKTOP_VIEWPORT);
  await page.goto("/");
  await openPanel(page, "dashboard-panel");
  await panelPinButton(page, "dashboard-panel").click();

  await page
    .locator('button[aria-controls="dashboard-panel"]:visible')
    .first()
    .click();

  await expect(page.locator("#dashboard-panel")).toHaveAttribute(
    "aria-hidden",
    "true",
  );
});
