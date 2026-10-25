import { expect } from "@playwright/test";

import { syncTest as test } from "./__fixture__";
import { openDevice, waitForSaved } from "./__util__";

test("2. 이미 열린 다른 기기에서도 새로고침 없이 저장된 글을 가져온다", async ({ devices: { desktop, mobile } }) => {
  await openDevice(desktop);
  await openDevice(mobile);
  await desktop.locator("textarea").first().fill("열린 기기로 전달할 글");
  await waitForSaved(desktop);
  await expect(mobile.locator("textarea").first()).toHaveValue("열린 기기로 전달할 글", { timeout: 15_000 });
});
