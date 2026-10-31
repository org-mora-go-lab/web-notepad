import { expect } from "@playwright/test";

import { boardTest as test } from "../../__fixture__";
import { openBoard } from "../../__util__";

test("8. 시스템 집계 그룹을 제외하고 실제 그룹만 보드에 표시한다", async ({
  page,
  boardPost,
}) => {
  await openBoard(page);
  const systemNames = [
    "All Group",
    "All My Group",
    "All Shared Group",
    "All My Ungrouped",
    "Ungrouped",
  ];
  const rows = page.locator(".board-table tbody tr");

  await expect(rows).not.toHaveCount(0);
  await expect(
    page.locator(".board-table tbody tr.is-system-group"),
  ).toHaveCount(0);
  await expect(page.locator(".board-system-groups")).toHaveCount(0);
  for (const name of systemNames)
    await expect(
      page.locator(".board-entry strong", { hasText: name }),
    ).toHaveCount(0);

  const actualGroup = page.locator(
    `.board-entry[data-group-id="${boardPost.id}"]`,
  );
  await expect(actualGroup).toContainText(boardPost.title);
  await actualGroup.click();
  await expect(page).toHaveURL(new RegExp(`[?&]post=${boardPost.id}(?:&|$)`));
  await expect(page.locator(".board-detail")).toBeVisible();
});
