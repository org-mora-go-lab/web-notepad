import { expect } from "@playwright/test";

import { sharingTest as test } from "../../__fixture__";
import { openAccountMenu } from "../../__util__";

test("4. 이미 삭제를 확인한 탭의 지연 알람은 다음 그룹 조회 중에도 숨긴다", async ({
  sharing: { owner, guest, id },
}) => {
  let record = (
    await (await guest.request.get("/api/groups")).json()
  ).groups.find((group: { id: string }) => group.id === id);
  const old = record.data.tabs[0];
  let response = await guest.request.post("/api/groups/update", {
    data: {
      id,
      baseRevision: record.revision,
      data: {
        ...record.data,
        tabs: [
          { ...old, content: "Before deletion", title: "Before deletion" },
        ],
      },
    },
  });
  expect(response.ok()).toBe(true);
  record = (await response.json()).group;
  const stale = (
    await (await owner.request.get("/api/groups/notifications")).json()
  ).notifications;
  await owner.evaluate(() => window.dispatchEvent(new Event("focus")));
  await expect(owner.locator("textarea").first()).toHaveValue(
    "Before deletion",
  );
  response = await guest.request.post("/api/groups/update", {
    data: {
      id,
      baseRevision: record.revision,
      data: {
        ...record.data,
        tabs: [
          {
            ...old,
            id: old.id + "-replacement",
            content: "Remaining note",
            title: "Remaining note",
          },
        ],
      },
    },
  });
  expect(response.ok()).toBe(true);
  await owner.route("**/api/groups/notifications", (route) =>
    route.fulfill({ json: { notifications: stale } }),
  );
  await owner.evaluate(() => window.dispatchEvent(new Event("focus")));
  await expect(owner.locator("textarea").first()).toHaveValue("Remaining note");
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  let held = false;
  await owner.route("**/api/groups", async (route) => {
    held = true;
    await gate;
    await route.continue();
  });
  try {
    await owner.evaluate(() => window.dispatchEvent(new Event("focus")));
    await expect.poll(() => held).toBe(true);
    const account = await openAccountMenu(owner);
    await account.getByRole("menuitem", { name: "Alarm", exact: true }).click();
    await expect(owner.locator(".footer-notifications-panel")).toBeVisible();
    await expect(
      owner.locator(".footer-notifications-panel .notification-entry"),
    ).toHaveCount(0);
  } finally {
    release();
  }
});
