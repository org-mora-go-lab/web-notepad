import { expect, test } from "@playwright/test";

import { groupsCommand, seedSortableGroups } from "../../__util__";

test("1. 기본 사이드바는 My Group 목록과 하단 시스템 그룹을 표시한다", async ({
  page,
}) => {
  await seedSortableGroups(page);
  await groupsCommand(page).click();

  const items = page.locator(".group-item");
  await expect(
    page.getByRole("button", { name: "All Group", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Ungrouped", exact: true }),
  ).toBeVisible();
  await expect(items.filter({ hasText: "Closed" })).toHaveCount(0);
  await expect(items.first()).toContainText("가방");

  await expect(page.locator("#group-sidebar-list")).toBeVisible();
  await expect(page.locator("#group-my-list .group-item")).toHaveCount(5);
  await expect(
    page.getByRole("button", { name: "My Group", exact: true }),
  ).toHaveAttribute("aria-expanded", "true");
});
