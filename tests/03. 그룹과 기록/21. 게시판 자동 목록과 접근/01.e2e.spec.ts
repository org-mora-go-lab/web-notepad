import { expect } from "@playwright/test";

import { boardTest as test } from "../../__fixture__";
import { openBoard } from "../../__util__";

test("1. role admin은 관리자 화면을 열거나 관리 동작을 활성화하지 않는다", async ({ page, boardPost }) => {
  await page.goto("/?role=admin"); await expect(page.locator("#board-page")).toBeHidden();
  await openBoard(page); await page.getByRole("searchbox", { name: "Search shared groups" }).fill(boardPost.title);
  await page.locator(".board-entry").click();
  await expect(page.locator(".board-admin-badge, .board-admin-actions, .board-form, .board-publish, .board-remove-confirm")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Join this group" })).toBeVisible();
});
