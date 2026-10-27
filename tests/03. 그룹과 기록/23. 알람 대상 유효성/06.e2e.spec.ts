import { expect } from "@playwright/test";

import { sharingTest as test } from "../../__fixture__";
import { changeSharedNote, openAlarms } from "./__util__";

test("6. 알람을 열어도 읽지 않음을 유지하고 클릭한 항목만 읽음으로 저장한다", async ({
  sharing: { owner, guest, id },
}) => {
  await changeSharedNote(guest, id, "Unread first");
  await changeSharedNote(guest, id, "Unread second");
  const panel = await openAlarms(owner);
  const first = panel.locator(".notification-entry", {
    hasText: "Unread first",
  });
  const second = panel.locator(".notification-entry", {
    hasText: "Unread second",
  });
  await expect(
    first.getByRole("img", { name: "Unread", exact: true }),
  ).toBeVisible();
  await expect(second).toHaveClass(/is-unread/);
  const read = owner.waitForResponse(
    (r) => r.url().endsWith("/api/groups/notifications/read") && r.ok(),
  );
  await first.click();
  await read;
  await owner.reload();
  await openAlarms(owner);
  await expect(first).not.toHaveClass(/is-unread/);
  await expect(
    first.getByRole("img", { name: "Unread", exact: true }),
  ).toHaveCount(0);
  await expect(second).toHaveClass(/is-unread/);
});
