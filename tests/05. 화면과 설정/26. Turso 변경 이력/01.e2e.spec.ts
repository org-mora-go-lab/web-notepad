import { expect, test } from "@playwright/test";

import { signedSession } from "../../__fixture__";
import { authenticateBrowser, createGroups } from "../../__util__";
import { readCloudHistory } from "./__util__";

test("1. 그룹과 글 변경을 마지막 작업 3초 뒤 한 건으로 저장한다", async ({ page, context }) => {
  await authenticateBrowser(context, signedSession({
    id: `cloud-batch-${crypto.randomUUID()}`,
    nickname: "Cloud User",
    expiresAt: Date.now() + 60_000,
  }));
  await page.goto("/");
  await expect(page.locator("button.auth-command")).toContainText("Cloud User");
  await createGroups(page, "Batch group");
  await page.locator("textarea").first().fill("첫 번째 글");
  await page.locator("textarea").first().fill("마지막 글");
  await expect(page.locator(".cloud-save-status.is-pending")).toBeVisible();
  expect((await readCloudHistory(page)).count).toBe(0);
  await expect(page.locator(".cloud-save-status.is-saved")).toBeVisible({ timeout: 15_000 });
  const history = await readCloudHistory(page);
  expect(history.count).toBe(1);
  const snapshot = JSON.parse(history.latest!.snapshot);
  expect(snapshot.groups.some((group: { name: string }) => group.name === "Batch group")).toBe(true);
  expect(snapshot.groups.flatMap((group: { tabs: { content: string }[] }) => group.tabs).some((tab: { content: string }) => tab.content === "마지막 글")).toBe(true);
});
