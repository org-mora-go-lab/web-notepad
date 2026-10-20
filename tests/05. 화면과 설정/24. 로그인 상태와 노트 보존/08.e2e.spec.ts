import { expect, test } from "@playwright/test";

import { authProfile, signedSession } from "../../__fixture__";
import { authenticateBrowser } from "../../__util__";

test("8. 닉네임의 HTML 문자열은 실행하지 않고 문자로 표시한다", async ({
  page,
  context,
}) => {
  const nickname = "<img src=x onerror=alert(1)>";
  await authenticateBrowser(
    context,
    signedSession({ ...authProfile, nickname, expiresAt: Date.now() + 60000 }),
  );
  await page.goto("/");
  await expect(page.locator("button.auth-command span")).toHaveText(nickname);
  await expect(page.locator("button.auth-command img")).toHaveCount(0);
});
