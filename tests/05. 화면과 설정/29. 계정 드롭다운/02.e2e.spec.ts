import { expect, test } from "@playwright/test";

import { authenticateBrowser } from "../../__util__";

test("2. 계정 메뉴의 보드는 공유 그룹 게시판을 연다", async ({ page, context }) => {
  await authenticateBrowser(context); await page.goto("/");
  await page.locator("button.auth-command").click();
  await page.getByRole("menuitem", { name: "Board", exact: true }).click();
  await expect(page.locator("#account-menu")).toHaveCount(0);
  await expect(page.locator("#board-panel")).toHaveAttribute("aria-hidden", "false");
});
