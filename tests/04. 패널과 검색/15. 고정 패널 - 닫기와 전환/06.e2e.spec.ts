import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT } from "../../__constant__";
import { bookmarkActiveTab, bookmarksCommand } from "../../__util__";
import { panelPinButton } from "../__util__";

test("6. 북마크를 열어도 고정된 북마크 패널을 유지한다", async ({ page }) => {
  await page.setViewportSize(DESKTOP_VIEWPORT);
  await page.goto("/");
  await bookmarkActiveTab(page, "bookmark source");
  await bookmarksCommand(page).click();
  await panelPinButton(page, "bookmarks-panel").click();
  await page.getByRole("button", { name: "Open", exact: true }).click();
  await expect(page.locator("#bookmarks-panel")).toHaveAttribute("aria-hidden", "false");
});
