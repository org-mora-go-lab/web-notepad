import { expect, test } from "@playwright/test";

import { groupsCommand, seedSortableGroups } from "../../__util__";

test("1. 사이드바 그룹 영역은 기본 그룹을 포함하고 화살표로 접고 펼친다", async ({ page }) => {
  await seedSortableGroups(page);
  await groupsCommand(page).click();

  const items = page.locator(".group-item");
  await expect(page.getByRole("button", { name: "All Group", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Ungrouped", exact: true })).toBeVisible();
  await expect(items.filter({ hasText: "Closed" })).toHaveCount(0);
  await expect(items.first()).toContainText("가방");

  const toggle = page.getByRole("button", { name: "GROUP", exact: true });
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator("#group-sidebar-list")).toHaveCount(0);
  await toggle.click();
  await expect(page.locator("#group-sidebar-list")).toBeVisible();
});
