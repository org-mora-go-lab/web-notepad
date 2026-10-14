import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT } from "../../__constant__";
import { closeActiveTabWithContent, openClosedPanel, restoreFirstClosedTab } from "../../__util__";
import { panelPinButton } from "../__util__";

test("7. 닫은 탭을 복원해도 고정된 Closed 패널을 유지한다", async ({ page }) => {
  await page.setViewportSize(DESKTOP_VIEWPORT);
  await page.goto("/");
  await closeActiveTabWithContent(page, "restore from pinned panel");
  await openClosedPanel(page);
  await panelPinButton(page, "closed-panel").click();
  await restoreFirstClosedTab(page);
  await expect(page.locator("#closed-panel")).toHaveAttribute("aria-hidden", "false");
});
