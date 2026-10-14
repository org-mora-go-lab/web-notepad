import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT } from "../../__constant__";
import { openPanel } from "../../__util__";
import { panelPinButton } from "../__util__";

test("4. 경계 그라데이션은 패널을 고정하거나 닫으면 제거하고 고정을 해제하면 복원한다", async ({ page }) => {
  await page.setViewportSize(DESKTOP_VIEWPORT);
  await page.goto("/");
  await openPanel(page, "bookmarks-panel");
  const panel = page.locator("#bookmarks-panel");
  const content = () => panel.evaluate((element) => getComputedStyle(element, "::before").content);
  await expect.poll(content).not.toBe("none");
  await panelPinButton(page, "bookmarks-panel").click();
  await expect.poll(content).toBe("none");
  await panelPinButton(page, "bookmarks-panel").click();
  await expect.poll(content).not.toBe("none");
  await panel.locator(".side-panel-close").click();
  await expect.poll(content).toBe("none");
});
