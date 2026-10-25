import { expect } from "@playwright/test";

import { syncTest as test } from "./__fixture__";
import { openDevice, waitForSaved } from "./__util__";

test("2. 다른 기기의 화면을 다시 활성화하면 저장된 글을 가져온다", async ({ devices: { desktop, mobile } }) => {
  await openDevice(desktop);
  await openDevice(mobile);
  await desktop.locator("textarea").first().fill("열린 기기로 전달할 글");
  await waitForSaved(desktop);
  await mobile.evaluate(() => window.dispatchEvent(new Event("focus")));
  await expect(mobile.locator("textarea").first()).toHaveValue("열린 기기로 전달할 글", { timeout: 15_000 });
});
