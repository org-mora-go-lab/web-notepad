import { expect, test } from "@playwright/test";

import { authProfile } from "../../__fixture__";
import { authenticateBrowser } from "../../__util__";

test("6. Logout 서버 오류는 계정 표시를 보존하고 재시도를 허용한다", async ({
  page,
  context,
}) => {
  await authenticateBrowser(context);
  await page.route("**/api/auth/logout", (route) =>
    route.fulfill({ status: 500, json: { error: "unavailable" } }),
  );
  await page.goto("/");
  const account = page.getByRole("button", {
    name: authProfile.nickname + " · Account menu",
  });
  await account.click();
  const failed = page.waitForResponse(
    (response) =>
      response.url().endsWith("/api/auth/logout") && response.status() === 500,
  );
  await page.getByRole("menuitem", { name: "Logout", exact: true }).click();
  await failed;
  await expect(
    page.getByRole("menuitem", { name: "Logout", exact: true }),
  ).toBeEnabled();
  await expect(account).toBeEnabled();
  await expect(page.locator("a.auth-command")).toHaveCount(0);
});
