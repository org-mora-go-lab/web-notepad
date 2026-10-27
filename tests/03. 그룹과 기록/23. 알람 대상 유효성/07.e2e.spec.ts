import { expect } from "@playwright/test";

import { sharingTest as test } from "../../__fixture__";
import { changeSharedNote, openAlarms } from "./__util__";

test("7. 전체 알람 비우기는 내 목록만 영구 비우며 이후 새 알람은 수신한다", async ({
  sharing: { owner, guest, id },
}) => {
  await changeSharedNote(guest, id, "Clear my alarms");
  await changeSharedNote(owner, id, "Keep guest alarms");
  const guestBefore = (
    await (await guest.request.get("/api/groups/notifications")).json()
  ).notifications;
  expect(guestBefore.length).toBeGreaterThan(0);
  const panel = await openAlarms(owner);
  const clear = panel.getByRole("button", {
    name: "Clear all alarms",
    exact: true,
  });
  await expect(panel.locator(".notification-entry")).not.toHaveCount(0);
  const heading = (await panel.locator("h2").boundingBox())!,
    button = (await clear.boundingBox())!;
  expect(button.x).toBeGreaterThan(heading.x);
  expect(Math.abs(button.y - heading.y)).toBeLessThan(24);
  await clear.click();
  await expect(panel.locator(".notification-entry")).toHaveCount(0);
  await expect(clear).toBeDisabled();
  await owner.reload();
  await openAlarms(owner);
  await expect(panel.locator(".notification-entry")).toHaveCount(0);
  expect(
    (await (await guest.request.get("/api/groups/notifications")).json())
      .notifications,
  ).toEqual(guestBefore);
  const groups = (await (await owner.request.get("/api/groups")).json()).groups;
  expect(
    groups.find((g: { id: string }) => g.id === id).data.tabs[0].content,
  ).toBe("Keep guest alarms");
  await changeSharedNote(guest, id, "Fresh after clear");
  await owner.keyboard.press("Escape");
  await openAlarms(owner);
  await expect(
    panel.locator(".notification-entry", { hasText: "Fresh after clear" }),
  ).toHaveClass(/is-unread/);
  await expect(
    panel.locator(".notification-entry", { hasText: "Clear my alarms" }),
  ).toHaveCount(0);
});
