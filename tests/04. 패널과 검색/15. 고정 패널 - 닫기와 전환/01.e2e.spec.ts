import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT } from "../../__constant__";
import { openMoreMenu, openPanel } from "../../__util__";

test("1. Bookmark 팝업에서 Bookmark 명령을 다시 선택하면 팝업을 닫는다", async ({
  page,
}) => {
  await page.setViewportSize(DESKTOP_VIEWPORT);
  await page.goto("/");
  await openPanel(page, "bookmarks-panel");
  const menu = await openMoreMenu(page);
  await menu.getByRole("button", { name: /Bookmark|북마크/i }).click();
  await expect(page.locator("#bookmarks-panel")).toHaveAttribute(
    "aria-hidden",
    "true",
  );
});
