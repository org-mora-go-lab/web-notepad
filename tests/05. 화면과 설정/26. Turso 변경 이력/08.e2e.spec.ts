import { expect, test } from "@playwright/test";

import { signedSession } from "../../__fixture__";
import { authenticateBrowser } from "../../__util__";
import { readCloudHistory } from "./__util__";

test("8. 열린 탭을 닫으면 저장 대기 중인 본문도 DB 스냅샷에서 제거한다", async ({
  page,
  context,
}) => {
  await authenticateBrowser(
    context,
    signedSession({
      id: `cloud-close-${crypto.randomUUID()}`,
      nickname: "Cloud User",
      expiresAt: Date.now() + 60_000,
    }),
  );
  await page.goto("/");
  await page.locator("textarea").first().fill("닫기 전에 저장할 본문");
  await page.locator(".tab-item.is-active .tab-close").click();
  await expect(page.locator(".home")).toHaveAttribute(
    "data-cloud-save",
    "saved",
  );
  expect((await readCloudHistory(page)).latest?.snapshot).not.toContain(
    "닫기 전에 저장할 본문",
  );
});
