import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT } from "../../__constant__";
import { groupsCommand, openPanel } from "../../__util__";

test("1. 고정한 Bookmark 패널에서 Bookmark 명령을 다시 선택하면 패널을 닫는다", async ({ page }) => {
  await page.setViewportSize(DESKTOP_VIEWPORT);
  await page.goto("/");
  await openPanel(page, "bookmarks-panel");
  await expect(groupsCommand(page)).toHaveAttribute("aria-expanded", "false");
  await groupsCommand(page).press("Enter");
  await expect(groupsCommand(page)).toHaveAttribute("aria-expanded", "true");
  const activeGroup = page.locator("[data-group-id].is-active");
  await activeGroup.locator(".group-actions > button").click();
  await activeGroup.getByRole("button", { name: /Bookmark|북마크/i }).click();
  await expect(page.locator("#bookmarks-panel")).toHaveAttribute("aria-hidden", "true");
});
