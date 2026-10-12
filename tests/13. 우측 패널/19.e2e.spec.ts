import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT } from "../__constant__";
import { createGroups, groupsCommand, openPanel } from "../__util__";
import { closePanelWithX, panelPinButton } from "./__util__";

test("19. 고정한 패널은 X 버튼을 누르기 전까지 Escape·명령 재선택·항목 선택·뒤로가기로 닫지 않는다", async ({ page }) => {
  await page.setViewportSize(DESKTOP_VIEWPORT);
  await page.goto("/");
  // Creating a group switches to it, so the panel starts on Alpha.
  await createGroups(page, "Alpha");
  await openPanel(page, "groups-panel");
  const panel = page.locator("#groups-panel");
  await panelPinButton(page, "groups-panel").click();

  await page.keyboard.press("Escape");
  await expect(panel).toHaveAttribute("aria-hidden", "false");

  await groupsCommand(page).click();
  await expect(panel).toHaveAttribute("aria-hidden", "false");

  await panel.locator(".group-item").getByRole("button", { name: "Ungrouped", exact: true }).click();
  await expect(page.locator(".group-status-name")).toHaveText("Ungrouped");
  await expect(panel).toHaveAttribute("aria-hidden", "false");

  await page.goBack();
  await expect(page.locator(".group-status-name")).toHaveText("Alpha");
  await expect(panel).toHaveAttribute("aria-hidden", "false");

  await closePanelWithX(page, "groups-panel");
  await expect(panel).toHaveAttribute("aria-hidden", "true");
});
