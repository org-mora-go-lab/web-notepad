import { expect } from "@playwright/test";

import { sharingTest as test } from "../../__fixture__";
import { openAccountMenu } from "../../__util__";

test("3. 사용자 ID를 기준으로 내 수정 알람은 제외한다", async ({
  sharing: { owner, guest, id },
}) => {
  let record = (
    await (await owner.request.get("/api/groups")).json()
  ).groups.find((group: { id: string }) => group.id === id);
  const update = await owner.request.post("/api/groups/update", {
    data: {
      id,
      baseRevision: record.revision,
      data: {
        ...record.data,
        tabs: record.data.tabs.map((tab: { content: string }) => ({
          ...tab,
          content: "My own change",
          title: "My own change",
        })),
      },
    },
  });
  expect(update.ok()).toBe(true);
  record = (await update.json()).group;
  expect(
    (await (await owner.request.get("/api/groups/notifications")).json())
      .notifications,
  ).toEqual([]);
  expect(
    (await (await guest.request.get("/api/groups/notifications")).json())
      .notifications,
  ).toHaveLength(1);
  const user = (await (await owner.request.get("/api/auth/session")).json())
    .user;
  await owner.route("**/api/groups/notifications", (route) =>
    route.fulfill({
      json: {
        notifications: [
          {
            id: 1,
            groupId: id,
            tabId: record.data.tabs[0].id,
            actorId: user.id,
            actorName: user.nickname,
            groupName: record.data.name,
            summary: "My own change",
            createdAt: Date.now(),
            unread: true,
          },
        ],
      },
    }),
  );
  await owner.evaluate(() => window.dispatchEvent(new Event("focus")));
  const account = await openAccountMenu(owner);
  await account.getByRole("menuitem", { name: "Alarm", exact: true }).click();
  await expect(
    owner.locator(".footer-notifications-panel .notification-entry"),
  ).toHaveCount(0);
});
