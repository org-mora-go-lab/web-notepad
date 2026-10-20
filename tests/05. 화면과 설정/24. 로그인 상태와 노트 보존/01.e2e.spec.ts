import { expect, test } from "@playwright/test";

import { authProfile } from "../../__fixture__";
import { authenticateBrowser } from "../../__util__";

test("1. 서명 세션으로 접속하면 닉네임과 로그아웃 동작을 표시한다", async ({
  page,
  context,
}) => {
  await authenticateBrowser(context);
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: authProfile.nickname + " · Log out" }),
  ).toBeEnabled();
  await expect(page.locator("a.auth-command")).toHaveCount(0);
});
