import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT } from "../__constant__";
import { bookmarksCommand, createGroups, groupStatusName, openPanel, switchGroup } from "../__util__";
import { closePanelWithX, panelPinButton } from "./__util__";

test("19. 고정한 패널은 X 버튼을 누르기 전까지 Escape·명령 재선택·그룹 선택·뒤로가기로 닫지 않는다", async ({ page }) => {
  await page.setViewportSize(DESKTOP_VIEWPORT);
  await page.goto("/");
  // Creating a group switches to it, so the panel starts on Alpha.
  await createGroups(page, "Alpha");
  await openPanel(page, "bookmarks-panel");
  const panel = page.locator("#bookmarks-panel");
  await panelPinButton(page, "bookmarks-panel").click();

  await page.keyboard.press("Escape");
  await expect(panel).toHaveAttribute("aria-hidden", "false");

  await bookmarksCommand(page).click();
  await expect(panel).toHaveAttribute("aria-hidden", "false");

  await switchGroup(page, "Ungrouped");
  await expect(groupStatusName(page)).toHaveText("Ungrouped");
  await expect(panel).toHaveAttribute("aria-hidden", "false");

  await page.goBack();
  await expect(groupStatusName(page)).toHaveText("Alpha");
  await expect(panel).toHaveAttribute("aria-hidden", "false");

  await closePanelWithX(page, "bookmarks-panel");
  await expect(panel).toHaveAttribute("aria-hidden", "true");
});
