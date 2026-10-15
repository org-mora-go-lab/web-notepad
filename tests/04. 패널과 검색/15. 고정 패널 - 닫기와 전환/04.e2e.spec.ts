import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT } from "../../__constant__";
import { closeActiveTabWithContent, openClosedPanel } from "../../__util__";
import { panelPinButton } from "../__util__";

test("4. 닫힌 탭을 다시 열어도 고정된 Closed 패널을 유지한다", async ({ page }) => {
  await page.setViewportSize(DESKTOP_VIEWPORT);
  await page.goto("/");
  await closeActiveTabWithContent(page, "restore from pinned panel");
  await openClosedPanel(page);
  await panelPinButton(page, "closed-panel").click();
  await page.locator("#closed-panel").getByRole("button", { name: "Reopen" }).click();
  await expect(page.locator("#closed-panel")).toHaveAttribute("aria-hidden", "false");
});
