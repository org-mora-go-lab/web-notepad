import { expect } from "@playwright/test";

import { sharingTest as test, signedSession } from "../../__fixture__";
import { authenticateBrowser, readStoredState } from "../../__util__";

test("3. 공유 그룹 비회원은 탭 링크로 내용을 열 수 없다", async ({
  browser,
  baseURL,
  sharing,
}) => {
  const context = await browser.newContext({ baseURL });
  try {
    await authenticateBrowser(
      context,
      signedSession({
        id: "outsider-" + crypto.randomUUID(),
        nickname: "Outsider",
        expiresAt: Date.now() + 300_000,
      }),
    );
    const page = await context.newPage();
    const url = new URL("/", baseURL);
    url.searchParams.set("group", sharing.id);
    url.searchParams.set("leftTab", sharing.group.tabs[0].id);
    url.searchParams.set("pane", "left");
    await page.goto(url.toString());
    await expect(page.locator("textarea")).toBeVisible();
    await expect
      .poll(async () => (await readStoredState(page)).activeGroupId)
      .not.toBe(sharing.id);
    await expect(page.locator("textarea")).not.toHaveValue("Keep this note");
  } finally {
    await context.close();
  }
});
