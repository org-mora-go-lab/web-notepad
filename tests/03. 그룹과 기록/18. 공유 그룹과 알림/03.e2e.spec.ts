import { expect, test } from "@playwright/test";

import { signedSession } from "../../__fixture__";
import { authenticateBrowser } from "../../__util__";
import { shareGroup } from "./__util__";

test("3. 공유받은 사용자의 수정은 공유자에게 반영되고 알림으로 보인다", async ({ browser }) => {
  const owner = await browser.newContext();
  const ownerPage = await owner.newPage();
  await authenticateBrowser(owner, signedSession({ id: `share-owner-${crypto.randomUUID()}`, nickname: "Owner", expiresAt: Date.now() + 60_000 }));
  await ownerPage.goto("/");
  await expect(ownerPage.locator("button.auth-command")).toBeVisible();
  const { dialog, url } = await shareGroup(ownerPage, "Team notes");
  await dialog.getByRole("button", { name: "Close", exact: true }).last().click();

  const guest = await browser.newContext();
  await authenticateBrowser(guest, signedSession({ id: `share-guest-${crypto.randomUUID()}`, nickname: "Guest", expiresAt: Date.now() + 60_000 }));
  const guestPage = await guest.newPage();
  await guestPage.goto(url);
  await expect(guestPage.getByText("Shared group added. You can edit it now.")).toBeVisible();
  await guestPage.getByRole("button", { name: "Close", exact: true }).last().click();
  await guestPage.locator("textarea").first().fill("Guest wrote this note");
  await expect(ownerPage.locator("textarea").first()).toHaveValue("Guest wrote this note", { timeout: 20_000 });
  const notification = ownerPage.locator(".notification-command");
  await expect(notification).toHaveAttribute("aria-label", /1 unread update/, { timeout: 15_000 });
  await notification.click();
  await expect(ownerPage.locator(".footer-notifications-panel")).toContainText("Guest");
  await expect(ownerPage.locator(".footer-notifications-panel")).toContainText("글 수정");
  await guest.close();
  await owner.close();
});
