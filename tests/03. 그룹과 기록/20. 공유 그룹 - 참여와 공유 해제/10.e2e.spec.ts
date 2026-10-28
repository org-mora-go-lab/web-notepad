import { expect } from "@playwright/test";

import { groupsCommand } from "../../__util__";
import { sharingTest as test } from "./__fixture__";

test("10. 공유 취소 후 My Group의 동작 버튼은 유지한다", async ({
  sharing: { owner, id },
}) => {
  const response = await owner.request.post("/api/groups/revoke", {
    data: { id },
  });
  expect(response.ok()).toBe(true);
  await owner.reload();
  if ((await groupsCommand(owner).getAttribute("aria-expanded")) !== "true")
    await groupsCommand(owner).click();

  const row = owner.locator(`#group-my-list [data-group-id="${id}"]`);
  await expect(row).toBeVisible();
  await expect(row.locator(".group-actions > button")).toBeVisible();
});
