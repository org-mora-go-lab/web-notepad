import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT } from "../../__constant__";
import { openGlobalSearchPanel, openPanel } from "../../__util__";
import { panelPinButton, workspaceBounds } from "../__util__";

test("4. 검색 팝업을 열고 닫아도 고정 대시보드를 유지한다", async ({ page }) => {
  await page.setViewportSize(DESKTOP_VIEWPORT);
  await page.goto("/");
  await openPanel(page, "dashboard-panel");
  await panelPinButton(page, "dashboard-panel").click();
  const pinnedWorkspaceWidth = (await workspaceBounds(page)).width;
  await openGlobalSearchPanel(page);

  await expect(page.locator("#dashboard-panel")).toHaveAttribute("aria-hidden", "false");
  await expect(panelPinButton(page, "dashboard-panel")).toHaveAttribute("aria-pressed", "true");
  expect((await workspaceBounds(page)).width).toBeCloseTo(pinnedWorkspaceWidth, 0);

  await page.locator(".global-search-close").click();
  await expect(page.locator("#global-search-popup")).not.toHaveAttribute("open", "");
  await expect(page.locator("#dashboard-panel")).toHaveAttribute("aria-hidden", "false");
  await expect(panelPinButton(page, "dashboard-panel")).toHaveAttribute("aria-pressed", "true");
});
