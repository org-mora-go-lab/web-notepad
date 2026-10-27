import { expect, test } from "@playwright/test";

import { authenticateBrowser, openBoard } from "../../__util__";

test("2. 보드는 계정 메뉴에서 제외하고 더보기에서 열 수 있다", async ({
  page,
  context,
}) => {
  await authenticateBrowser(context);
  await page.goto("/");
  await page.locator("button.auth-command").click();
  await expect(
    page.getByRole("menuitem", { name: "Board", exact: true }),
  ).toHaveCount(0);
  await page.keyboard.press("Escape");
  await openBoard(page);
  await expect(page).toHaveURL(/\/board$/);
  await expect(page.locator("#board-page")).toBeVisible();
});
