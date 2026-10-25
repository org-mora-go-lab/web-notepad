import { expect, test } from "@playwright/test";

import { signedSession } from "../../__fixture__";
import { authenticateBrowser } from "../../__util__";
import { shareGroup } from "./__util__";

test("4. 공유자의 수정은 공유받은 사용자에게 반영된다", async ({ browser }) => {
  const owner = await browser.newContext();
  await authenticateBrowser(owner, signedSession({ id: `share-owner-${crypto.randomUUID()}`, nickname: "Owner", expiresAt: Date.now() + 60_000 }));
  const ownerPage = await owner.newPage();
  await ownerPage.goto("/");
  const { dialog, url } = await shareGroup(ownerPage, "Owner notes");
  await dialog.getByRole("button", { name: "Close", exact: true }).last().click();

  const guest = await browser.newContext();
  await authenticateBrowser(guest, signedSession({ id: `share-guest-${crypto.randomUUID()}`, nickname: "Guest", expiresAt: Date.now() + 60_000 }));
  const guestPage = await guest.newPage();
  await guestPage.goto(url);
  await expect(guestPage.getByText("Shared group added. You can edit it now.")).toBeVisible();
  await guestPage.getByRole("button", { name: "Close", exact: true }).last().click();
  await ownerPage.locator("textarea").first().fill("Owner updated the group");
  await expect(guestPage.locator("textarea").first()).toHaveValue("Owner updated the group", { timeout: 20_000 });
  await owner.close();
  await guest.close();
});
