import { expect, test } from "@playwright/test";

import { authenticateBrowser, openMoreMenu } from "../../__util__";

test("2. Board는 더보기와 계정 메뉴에서 제거하고 푸터에서 연다", async ({
  page,
  context,
}) => {
  await authenticateBrowser(context);
  await page.goto("/");
  const more = await openMoreMenu(page);
  await expect(more.getByRole("button", { name: /Board/i })).toHaveCount(0);
  await page.keyboard.press("Escape");
  await page.locator("button.auth-command").click();
  await expect(
    page.getByRole("menuitem", { name: "Board", exact: true }),
  ).toHaveCount(0);
  await page.keyboard.press("Escape");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator(".board-command").click();
  await expect(page).toHaveURL(/\/board$/);
  await expect(page.locator("#board-page")).toBeVisible();
});
