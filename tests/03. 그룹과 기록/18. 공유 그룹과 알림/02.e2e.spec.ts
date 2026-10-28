import { expect, test } from "@playwright/test";

import { signedSession } from "../../__fixture__";
import { authenticateBrowser } from "../../__util__";
import { getApi } from "../../__util__/request";
import { shareGroup } from "./__util__";

test("2. 비로그인 공유 링크는 로그인 안내와 복귀 링크를 제공한다", async ({
  browser,
}) => {
  const owner = await browser.newContext();
  const ownerPage = await owner.newPage();
  await authenticateBrowser(
    owner,
    signedSession({
      id: `share-owner-${crypto.randomUUID()}`,
      nickname: "Owner",
      expiresAt: Date.now() + 60_000,
    }),
  );
  await ownerPage.goto("/");
  await expect(ownerPage.locator("button.auth-command")).toBeVisible();
  const { url } = await shareGroup(ownerPage, "Invite group");

  const guest = await browser.newContext();
  const guestPage = await guest.newPage();
  await guestPage.goto(url);
  const dialog = guestPage.getByRole("dialog", { name: "Share" });
  await expect(dialog).toContainText(
    "Log in with Kakao to edit this shared group.",
  );
  const login = dialog.getByRole("link", { name: "Continue with Kakao" });
  await expect(login).toHaveAttribute(
    "href",
    /\/api\/auth\/oauth\/kakao\?share=/,
  );
  const response = await getApi(
    guest.request,
    (await login.getAttribute("href")) ?? "",
    { maxRedirects: 0 },
  );
  expect(response.status()).toBe(307);
  expect(response.headers()["set-cookie"]).toContain(
    "web-notepad-share-return",
  );
  await guest.close();
  await owner.close();
});
