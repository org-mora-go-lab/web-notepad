import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT } from "../../__constant__";
import { openPanel } from "../../__util__";
import { panelPinButton } from "../__util__";

test("2. Escape를 눌러도 고정 패널을 닫지 않는다", async ({ page }) => {
  await page.setViewportSize(DESKTOP_VIEWPORT);
  await page.goto("/");
  await openPanel(page, "bookmarks-panel");
  await panelPinButton(page, "bookmarks-panel").click();
  await page.keyboard.press("Escape");
  await expect(page.locator("#bookmarks-panel")).toHaveAttribute("aria-hidden", "false");
});
