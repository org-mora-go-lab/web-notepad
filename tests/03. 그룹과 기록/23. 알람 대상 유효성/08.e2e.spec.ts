import { expect } from "@playwright/test";

import { sharingTest as test } from "../../__fixture__";
import { changeSharedNote, openAlarms } from "./__util__";

test("8. 알람 비우기 실패 시 목록을 유지하고 오류 후 재시도할 수 있다", async ({ sharing: { owner, guest, id } }) => {
  await changeSharedNote(guest, id, "Preserve failed clear");
  const panel = await openAlarms(owner);
  await owner.route("**/api/groups/notifications", route => route.request().method() === "DELETE"
    ? route.fulfill({ status: 503, json: { error: "Unavailable" } }) : route.continue());
  const clear = panel.getByRole("button", { name: "Clear all alarms", exact: true });
  await clear.click(); await expect(panel.getByRole("alert")).toBeVisible();
  await expect(panel.locator(".notification-entry", { hasText: "Preserve failed clear" })).toBeVisible();
  await owner.unroute("**/api/groups/notifications"); await clear.click();
  await expect(panel.locator(".notification-entry")).toHaveCount(0);
  await expect(panel.getByRole("alert")).toHaveCount(0);
});
