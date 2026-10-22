import { expect, test } from "@playwright/test";

import { groupsCommand, seedSortableGroups } from "../../__util__";

test("1. 사이드바 그룹 목록은 접기 영역 없이 기본 그룹과 함께 항상 표시한다", async ({ page }) => {
  await seedSortableGroups(page);
  await groupsCommand(page).click();

  const items = page.locator(".group-item");
  await expect(page.getByRole("button", { name: "All Group", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Ungrouped", exact: true })).toBeVisible();
  await expect(items.filter({ hasText: "Closed" })).toHaveCount(0);
  await expect(items.first()).toContainText("가방");

  await expect(page.locator("#group-sidebar-list")).toBeVisible();
  await expect(page.locator(".group-section-toggle")).toHaveCount(0);
});
