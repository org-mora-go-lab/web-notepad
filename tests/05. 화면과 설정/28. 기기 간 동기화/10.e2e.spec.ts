import { expect } from "@playwright/test";

import { syncTest as test } from "./__fixture__";
import { openDevice } from "./__util__";

test("10. 편집 없이 대기하는 동안 서버 상태를 주기적으로 조회하지 않는다", async ({ devices: { desktop } }) => {
  await desktop.clock.install();
  const initialNotifications = desktop.waitForResponse(response => response.url().endsWith("/api/groups/notifications") && response.ok());
  await openDevice(desktop);
  await initialNotifications;
  const unexpectedRequest = desktop.waitForRequest(request => request.method() === "GET" && ["/api/notepad/history", "/api/groups", "/api/groups/notifications"].includes(new URL(request.url()).pathname), { timeout: 1500 }).then(() => true, () => false);
  await desktop.clock.fastForward(30_000);
  expect(await unexpectedRequest).toBe(false);
});
