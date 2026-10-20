import { expect, test } from "@playwright/test";

test("5. 세션 조회 네트워크 실패 후에도 로그인 진입점을 다시 활성화한다", async ({
  page,
}) => {
  await page.route("**/api/auth/session", (route) => route.abort());
  await page.goto("/");
  await expect(page.locator("a.auth-command")).toHaveAttribute(
    "aria-disabled",
    "false",
  );
  await expect(page.locator("textarea")).toBeEditable();
});
