import { expect, test } from "@playwright/test";

import { signedSession } from "../../__fixture__";
import { authenticateBrowser } from "../../__util__";
import { readCloudHistory } from "./__util__";

test("7. 탭 본문은 3자부터 저장하고 다시 2자 이하가 되면 DB에서 제거한다", async ({
  page,
  context,
}) => {
  await authenticateBrowser(
    context,
    signedSession({
      id: `cloud-threshold-${crypto.randomUUID()}`,
      nickname: "Cloud User",
      expiresAt: Date.now() + 60_000,
    }),
  );
  await page.goto("/");
  const editor = page.locator("textarea").first();
  await editor.fill("ab");
  await page.waitForTimeout(400);
  expect((await readCloudHistory(page)).latest).toBeNull();
  await editor.fill("abc");
  await expect(page.locator(".home")).toHaveAttribute(
    "data-cloud-save",
    "saved",
  );
  expect((await readCloudHistory(page)).latest?.snapshot).toContain("abc");
  await editor.fill("ab");
  await expect(page.locator(".home")).toHaveAttribute(
    "data-cloud-save",
    "saved",
  );
  const snapshot = (await readCloudHistory(page)).latest?.snapshot ?? "";
  expect(snapshot).not.toContain('"content":"ab"');
});
