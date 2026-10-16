import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT } from "../../__constant__";
import { createGroups, openPanel, switchGroup } from "../../__util__";

test("3. 그룹을 전환해도 고정 패널을 열린 상태로 유지한다", async ({ page }) => {
  await page.setViewportSize(DESKTOP_VIEWPORT);
  await page.goto("/");
  await createGroups(page, "Alpha");
  await openPanel(page, "bookmarks-panel");
  await switchGroup(page, "Ungrouped");
  await expect(page.locator("#bookmarks-panel")).toHaveAttribute("aria-hidden", "false");
});
