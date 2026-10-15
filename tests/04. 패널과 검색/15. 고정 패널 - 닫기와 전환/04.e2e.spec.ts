import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT } from "../../__constant__";
import { openPanel } from "../../__util__";
import { panelPinButton } from "../__util__";

test("4. 다른 패널 명령을 선택하면 고정 상태를 유지한 채 해당 패널로 전환한다", async ({ page }) => {
  await page.setViewportSize(DESKTOP_VIEWPORT);
  await page.goto("/");
  await openPanel(page, "bookmarks-panel");
  await panelPinButton(page, "bookmarks-panel").click();
  await openPanel(page, "dashboard-panel");

  await expect(page.locator("#bookmarks-panel")).toHaveAttribute("aria-hidden", "true");
  await expect(page.locator("#dashboard-panel")).toHaveAttribute("aria-hidden", "false");
  await expect(panelPinButton(page, "dashboard-panel")).toHaveAttribute("aria-pressed", "true");
});
