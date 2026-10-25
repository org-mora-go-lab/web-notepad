import { expect } from "@playwright/test";

import { readStoredState } from "../../__util__";
import { syncTest as test } from "./__fixture__";
import { openDevice, waitForSaved } from "./__util__";

test("5. 같은 글의 동시 수정이 충돌하면 복구 탭으로 양쪽 본문을 남긴다", async ({ devices: { desktop, mobile } }) => {
  await openDevice(desktop);
  await desktop.locator("textarea").first().fill("공통 원본");
  await waitForSaved(desktop);
  await openDevice(mobile);
  await waitForSaved(mobile);
  await mobile.route("**/api/notepad/history", route => route.abort());
  await mobile.locator("textarea").first().fill("모바일에서 수정한 본문");
  await desktop.locator("textarea").first().fill("PC에서 수정한 본문");
  await waitForSaved(desktop);
  await mobile.unroute("**/api/notepad/history");
  await mobile.evaluate(() => window.dispatchEvent(new Event("focus")));
  await expect.poll(async () => (await readStoredState(mobile)).groups.flatMap(group => group.tabs.map(tab => tab.content)))
    .toEqual(expect.arrayContaining(["PC에서 수정한 본문", "모바일에서 수정한 본문"]));
  await waitForSaved(mobile);
});
