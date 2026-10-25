import { expect, test } from "@playwright/test";

import { authProfile } from "../../__fixture__";
import { authenticateBrowser } from "../../__util__";

test("1. 로그인 계정은 별도 로그아웃 아이콘 없이 닉네임과 로그아웃 동작을 제공한다", async ({
  page,
  context,
}) => {
  await authenticateBrowser(context);
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: authProfile.nickname + " · Account menu" }),
  ).toBeEnabled();
  await expect(page.locator("a.auth-command")).toHaveCount(0);
  await expect(page.locator("button.auth-command .lucide-log-out")).toHaveCount(0);
});
