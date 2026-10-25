import { expect, test } from "@playwright/test";

import { authProfile, SESSION_COOKIE } from "../../__fixture__";
import { authenticateBrowser } from "../../__util__";

test("4. 로그아웃 후 새로고침해도 로그인 링크를 유지한다", async ({
  page,
  context,
}) => {
  await authenticateBrowser(context);
  await page.goto("/");
  await page
    .getByRole("button", { name: authProfile.nickname + " · Account menu" })
    .click();
  await page.getByRole("menuitem", { name: "Log out", exact: true }).click();
  await expect(page.locator("a.auth-command")).toHaveAttribute(
    "aria-disabled",
    "false",
  );
  await page.reload();
  await expect(page.locator("a.auth-command")).toHaveAttribute(
    "aria-disabled",
    "false",
  );
  expect(
    (await context.cookies()).some((cookie) => cookie.name === SESSION_COOKIE),
  ).toBe(false);
});
