import { expect } from "@playwright/test";

import { syncTest as test } from "./__fixture__";
import { openDevice, waitForSaved } from "./__util__";

test("7. 서버 조회 실패 시 빈 상태를 업로드하지 않고 연결 복구 후 다시 읽는다", async ({ devices: { desktop, mobile } }) => {
  await openDevice(desktop);
  await desktop.locator("textarea").first().fill("서버에 보존할 글");
  await waitForSaved(desktop);
  let available = false;
  let posts = 0;
  await mobile.route("**/api/notepad/history", route => {
    if (route.request().method() === "POST") posts += 1;
    if (!available && route.request().method() === "GET") return route.fulfill({ status: 503, body: "unavailable" });
    return route.continue();
  });
  await mobile.goto("/");
  await expect(mobile.locator(".home")).toHaveAttribute("data-cloud-save", "error");
  expect(posts).toBe(0);
  available = true;
  await mobile.evaluate(() => window.dispatchEvent(new Event("focus")));
  await expect(mobile.locator("textarea").first()).toHaveValue("서버에 보존할 글");
  expect(posts).toBe(0);
});
