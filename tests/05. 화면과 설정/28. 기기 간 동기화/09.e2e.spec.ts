import { expect } from "@playwright/test";

import { createGroups, readStoredState } from "../../__util__";
import { syncTest as test } from "./__fixture__";
import { openDevice, waitForSaved } from "./__util__";

test("9. 서로 다른 기기에서 생성한 그룹의 탭 ID가 겹쳐도 두 글을 별도로 보존한다", async ({
  devices: { desktop, mobile },
}) => {
  await openDevice(desktop);
  await desktop.locator("textarea").first().fill("공통 원본");
  await waitForSaved(desktop);
  await openDevice(mobile);
  await waitForSaved(mobile);
  await mobile.route("**/api/notepad/history", (route) => route.abort());
  await createGroups(mobile, "Mobile draft group");
  await mobile.locator("textarea").first().fill("독립 생성 모바일 글");
  await createGroups(desktop, "Desktop draft group");
  await desktop.locator("textarea").first().fill("독립 생성 PC 글");
  await waitForSaved(desktop);
  await mobile.unroute("**/api/notepad/history");
  await mobile.evaluate(() => window.dispatchEvent(new Event("focus")));
  await expect
    .poll(async () => JSON.stringify(await readStoredState(mobile)))
    .toContain("독립 생성 PC 글");
  const state = await readStoredState(mobile);
  const tabs = state.groups.flatMap((group) => group.tabs);
  expect(tabs.map((tab) => tab.content)).toEqual(
    expect.arrayContaining(["독립 생성 PC 글", "독립 생성 모바일 글"]),
  );
  expect(new Set(tabs.map((tab) => tab.id)).size).toBe(tabs.length);
  await waitForSaved(mobile);
});
