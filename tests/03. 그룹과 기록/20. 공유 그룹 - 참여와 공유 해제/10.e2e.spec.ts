import { expect } from "@playwright/test";

import { sharingTest as test } from "../../__fixture__";
import { addTabButton, openAccountMenu } from "../../__util__";

test("10. Alarm은 진행 중인 그룹 갱신을 기다린 뒤 변경된 탭을 연다", async ({
  sharing: { owner, guest },
}) => {
  test.setTimeout(60000);
  await guest.keyboard.press("Escape");
  await addTabButton(guest).click();
  const content = "Alarm target second tab";
  const saved = guest.waitForResponse(
    (response) =>
      response.url().endsWith("/api/groups/update") &&
      response.request().method() === "POST" &&
      !!response.request().postData()?.includes(content),
  );
  await guest.locator("textarea").first().fill(content);
  expect((await saved).ok()).toBe(true);
  await owner
    .locator(".group-system-list")
    .getByRole("button", { name: "Ungrouped", exact: true })
    .click();
  await owner.keyboard.press("Escape");
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  let held = false;
  await owner.route("**/api/groups", async (route) => {
    if (!held) {
      held = true;
      await gate;
    }
    await route.continue();
  });
  try {
    await owner.reload();
    await expect(owner.locator("button.auth-command")).toBeVisible();
    await expect.poll(() => held).toBe(true);
    const menu = await openAccountMenu(owner);
    await menu.getByRole("menuitem", { name: "Alarm", exact: true }).click();
    const entry = owner
      .locator(".notification-entry")
      .filter({ hasText: "Guest" })
      .first();
    await expect(entry).toBeVisible();
    await entry.click();
    await expect(owner.locator(".footer-notifications-panel")).toHaveCount(0);
  } finally {
    release();
  }
  await expect(owner.locator(".tab-item.is-active .tab-title")).toHaveText(
    content,
  );
  await expect(owner.locator("textarea").first()).toHaveValue(content);
  const unexpectedSave = owner
    .waitForRequest((request) => request.url().endsWith("/api/groups/update"), {
      timeout: 1500,
    })
    .then(
      () => true,
      () => false,
    );
  expect(await unexpectedSave).toBe(false);
  const { groups } = await (await owner.request.get("/api/groups")).json();
  expect(JSON.stringify(groups)).toContain(content);
});
