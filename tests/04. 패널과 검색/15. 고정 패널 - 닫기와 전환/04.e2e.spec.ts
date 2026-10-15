import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT } from "../../__constant__";
import { closeActiveTabWithContent, openPanel } from "../../__util__";
import { panelPinButton } from "../__util__";

test("4. 닫힌 탭을 열어도 고정된 Dashboard 패널을 유지한다", async ({ page }) => {
  await page.setViewportSize(DESKTOP_VIEWPORT);
  await page.goto("/");
  await closeActiveTabWithContent(page, "restore from pinned panel");
  await openPanel(page, "dashboard-panel");
  await panelPinButton(page, "dashboard-panel").click();
  await page.locator(".dashboard-card", { hasText: "restore from pinned panel" }).click();
  await expect(page.locator("#dashboard-panel")).toHaveAttribute("aria-hidden", "false");
});
