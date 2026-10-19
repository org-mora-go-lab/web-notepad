import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";
import { chooseTabMenuItem, groupsCommand } from "../../__util__";

test("4. 그룹 오른쪽 아이콘의 Bookmark는 해당 그룹의 북마크 패널을 연다", async ({ page }) => {
  await page.goto("/");
  await chooseTabMenuItem(page, "Bookmark");
  await groupsCommand(page).click();
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    for (const name of ["All Group", "Ungrouped"]) {
      const systemRow = page.locator(".group-system-item", { has: page.getByRole("button", { name, exact: true }) });
      const trigger = systemRow.locator(".group-actions > button");
      await trigger.click();
      const anchor = (await trigger.boundingBox())!;
      const dropdown = (await systemRow.locator(".group-action-dropdown").boundingBox())!;
      const gap = dropdown.y >= anchor.y + anchor.height
        ? dropdown.y - anchor.y - anchor.height
        : anchor.y - dropdown.y - dropdown.height;
      expect(gap).toBeCloseTo(8, 1);
      expect(dropdown.y).toBeGreaterThanOrEqual(8);
      expect(dropdown.y + dropdown.height).toBeLessThanOrEqual(viewport.height - 8);
      await trigger.click();
    }
  }
  const row = page.locator(".group-system-item", { has: page.getByRole("button", { name: "Ungrouped", exact: true }) });
  await row.locator(".group-actions > button").click();
  await row.getByRole("button", { name: "Ungrouped · Bookmark" }).click();

  await expect(page.locator("#bookmarks-panel")).toHaveAttribute("aria-hidden", "false");
  await expect(page.locator("#bookmarks-panel")).toContainText("Empty note");
});
