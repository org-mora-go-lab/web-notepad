import { expect } from "@playwright/test";

import { syncTest as test } from "./__fixture__";
import { openDevice, readHistory, waitForSaved } from "./__util__";

test("8. 이전 버전을 기준으로 저장하면 409와 최신 이력을 반환하고 기존 글을 지킨다", async ({ devices: { desktop, userId } }) => {
  await openDevice(desktop);
  await desktop.locator("textarea").first().fill("최신 버전의 글");
  await waitForSaved(desktop);
  const before = await readHistory(desktop);
  const response = await desktop.request.post("/api/notepad/history", { data: {
    userId, eventId: crypto.randomUUID(), baseEventId: null, snapshot: before.latest!.snapshot,
  } });
  expect(response.status()).toBe(409);
  expect((await response.json()).latest.eventId).toBe(before.latest!.eventId);
  expect(await readHistory(desktop)).toEqual(before);
});
