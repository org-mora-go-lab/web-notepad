import { expect } from "@playwright/test";

import { sharingTest as test } from "../../__fixture__";
import { groupsCommand } from "../../__util__";

test("1. 소유권 확인 전에는 그룹을 임시 분류하지 않고 확인 후 올바른 영역에 표시한다", async ({ sharing: { owner, guest, id } }) => {
  let release!: () => void;
  const gate = new Promise<void>(resolve => { release = resolve; });
  let requested = false;
  await owner.route("**/api/groups", async route => { requested = true; await gate; await route.continue(); });
  try {
    await owner.reload();
    await expect.poll(() => requested).toBe(true);
    if (await groupsCommand(owner).getAttribute("aria-expanded") !== "true") await groupsCommand(owner).click();
    await expect(owner.locator('#group-shared-list [data-group-id="' + id + '"]')).toHaveCount(0);
    await expect(owner.locator('.group-access-skeleton')).toBeVisible();
  } finally { release(); }
  await expect(owner.locator('#group-my-list [data-group-id="' + id + '"]')).toBeVisible();
  await expect(owner.locator('#group-shared-list [data-group-id="' + id + '"]')).toHaveCount(0);
  await expect(owner.locator('.group-access-skeleton')).toHaveCount(0);
  await expect(guest.locator('#group-shared-list [data-group-id="' + id + '"]')).toBeVisible();
  await expect(guest.locator('#group-my-list [data-group-id="' + id + '"]')).toHaveCount(0);
});
