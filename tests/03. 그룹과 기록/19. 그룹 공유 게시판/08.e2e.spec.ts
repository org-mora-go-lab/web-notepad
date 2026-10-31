import { expect } from "@playwright/test";

import { boardTest as test } from "../../__fixture__";
import { openBoard } from "../../__util__";

test("8. 시스템 그룹 네 개를 흐린 목록 행으로 표시하고 상세화면을 연다", async ({
  page,
}) => {
  await openBoard(page);
  const rows = page.locator(".board-table tbody tr.is-system-group");
  const names = ["All Group", "All My Group", "All My Ungrouped", "Ungrouped"];
  const ids = ["all-group", "all-my-group", "all-my-ungrouped", "ungrouped"];

  await expect(rows).toHaveCount(4);
  await expect(rows.locator(".board-entry strong")).toHaveText(names);
  await expect(page.locator(".board-system-groups")).toHaveCount(0);
  for (const row of await rows.all())
    await expect(row).toHaveCSS("opacity", "0.8");

  for (const [index, id] of ids.entries()) {
    await rows.nth(index).locator(".board-entry").click();
    await expect(page).toHaveURL(new RegExp(`[?&]post=${id}(?:&|$)`));
    await expect(page.locator(".board-detail")).toBeVisible();
    await expect(page.locator(".fixed-page-header h1")).toHaveText(
      names[index],
    );
    await page.locator(".board-back").click();
    await expect(page.locator(".board-list")).toBeVisible();
  }
});
