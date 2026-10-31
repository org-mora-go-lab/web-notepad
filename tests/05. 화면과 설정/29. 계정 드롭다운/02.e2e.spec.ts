import { expect } from "@playwright/test";

import { boardTest as test } from "../../__fixture__";
import {
  authenticateBrowser,
  openMoreMenu,
  selectBoardPost,
} from "../../__util__";

test("2. Board는 더보기와 그룹 메뉴 하단에서 제거하고 계정 메뉴에서 연다", async ({
  page,
  context,
  boardPost,
}) => {
  await authenticateBrowser(context);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const more = await openMoreMenu(page);
  await expect(more.getByRole("button", { name: /Board/i })).toHaveCount(0);
  await page.keyboard.press("Escape");
  await page.locator("button.auth-command").click();
  await expect(page.locator(".group-board-command")).toHaveCount(0);
  await page.getByRole("menuitem", { name: "Board", exact: true }).click();
  await expect(page).toHaveURL(/\/board$/);
  await expect(page.locator("#board-page")).toBeVisible();
  await selectBoardPost(page, boardPost.title);
  await expect(page).toHaveURL(/\/board\?post=/);
  await page.locator("button.auth-command").click();
  await page.getByRole("menuitem", { name: "Board", exact: true }).click();
  await expect(page).toHaveURL(/\/board$/);
  await expect(page.locator(".board-list")).toBeVisible();
});
