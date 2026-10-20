import { expect, test } from "@playwright/test";

import { authenticateBrowser } from "../../__util__";

test("2. 프로필 이미지가 없는 계정은 사용자 아이콘을 표시한다", async ({
  page,
  context,
}) => {
  await authenticateBrowser(context);
  await page.goto("/");
  await expect(
    page.locator("button.auth-command .lucide-circle-user-round"),
  ).toBeVisible();
  await expect(page.locator("button.auth-command img")).toHaveCount(0);
});
